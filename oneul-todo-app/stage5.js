"use strict";

/* 5단계: 출시 전 품질 점검, 업데이트 안내, 미저장 보호 */
(function () {
  'use strict';

  var APP_VERSION = '1.0.0';
  var RELEASE_DATE = '2026-08-25';
  var sections = document.getElementById('taskSections');
  var modal = document.getElementById('taskModal');
  var form = document.getElementById('taskForm');
  var formError = document.getElementById('formError');
  var updateBanner = document.getElementById('updateBanner');
  var applyUpdateButton = document.getElementById('applyUpdateButton');
  var dismissUpdateButton = document.getElementById('dismissUpdateButton');
  var waitingWorker = null;
  var refreshing = false;
  var formBaseline = '';
  var formDirty = false;
  var diagnosticsRunning = false;

  window.OneulRelease = {
    version: APP_VERSION,
    releaseDate: RELEASE_DATE,
    stage: 5
  };

  function showNotice(message) {
    var snackbar = document.getElementById('snackbar');
    var snackbarMessage = document.getElementById('snackbarMessage');
    var undoButton = document.getElementById('undoButton');
    if (!snackbar || !snackbarMessage) return;
    snackbarMessage.textContent = message;
    if (undoButton) undoButton.hidden = true;
    snackbar.classList.add('is-visible');
    window.setTimeout(function () {
      snackbar.classList.remove('is-visible');
    }, 5000);
  }

  function browserName() {
    var ua = navigator.userAgent;
    if (/Edg\//.test(ua)) return 'Microsoft Edge';
    if (/CriOS\//.test(ua)) return 'Chrome iOS';
    if (/FxiOS\//.test(ua)) return 'Firefox iOS';
    if (/Chrome\//.test(ua)) return 'Google Chrome';
    if (/Firefox\//.test(ua)) return 'Mozilla Firefox';
    if (/Safari\//.test(ua)) return 'Apple Safari';
    return '현재 브라우저';
  }

  function supportSummary() {
    var required = [
      'indexedDB' in window,
      'Promise' in window,
      'fetch' in window,
      window.CSS && typeof CSS.supports === 'function' && CSS.supports('display', 'grid')
    ];
    return required.every(Boolean);
  }

  function healthMarkup(id, label) {
    return '<article class="health-item" role="listitem">' +
      '<div class="health-item-top"><strong>' + label + '</strong><span class="health-pill" id="health-' + id + '-pill">확인 중</span></div>' +
      '<span class="health-value" id="health-' + id + '-value">상태를 확인하고 있어요.</span>' +
      '</article>';
  }

  function mountReleaseStatus() {
    if (!sections || !sections.querySelector('[data-reset]') || sections.querySelector('[data-release-status]')) return false;
    var card = document.createElement('section');
    card.className = 'settings-card release-status-card';
    card.setAttribute('data-release-status', '');
    card.innerHTML = '<div class="release-heading"><h2 class="card-title">앱 상태와 출시 정보</h2><span class="permission-pill allowed">v' + APP_VERSION + '</span></div>' +
      '<p class="release-intro">5단계 품질 점검이 적용됐어요. 현재 브라우저의 저장소·오프라인·네트워크 상태를 바로 확인할 수 있습니다.</p>' +
      '<div class="health-grid" role="list" aria-label="앱 상태 진단">' +
      healthMarkup('browser', '브라우저 호환성') +
      healthMarkup('storage', '로컬 저장소') +
      healthMarkup('offline', '오프라인 준비') +
      healthMarkup('network', '네트워크') +
      '</div>' +
      '<div class="release-checks" aria-label="출시 전 점검 완료 항목"><span>✓ 320px 모바일</span><span>✓ 키보드 접근</span><span>✓ 다크 모드</span><span>✓ 데이터 백업</span></div>' +
      '<div class="settings-actions release-actions"><button class="small-button primary" type="button" data-run-diagnostics>상태 다시 확인</button><button class="small-button" type="button" data-integrity-check>데이터 무결성 검사</button><button class="small-button" type="button" data-apply-waiting-update hidden>업데이트 적용</button></div>' +
      '<p class="release-meta" id="releaseMeta">출시일 ' + RELEASE_DATE + ' · Chrome, Edge, Firefox, Safari 최신 버전 기준</p>';
    sections.appendChild(card);
    return true;
  }

  function setHealth(id, state, status, value) {
    var pill = document.getElementById('health-' + id + '-pill');
    var copy = document.getElementById('health-' + id + '-value');
    if (!pill || !copy) return;
    pill.className = 'health-pill ' + state;
    pill.textContent = status;
    copy.textContent = value;
  }

  function storageStatus() {
    if (!('indexedDB' in window)) {
      setHealth('storage', 'error', '지원 안 함', '이 브라우저에서는 임시 모드로 실행됩니다.');
      return Promise.resolve();
    }
    if (!navigator.storage || !navigator.storage.estimate) {
      setHealth('storage', 'success', '사용 가능', 'IndexedDB 로컬 저장을 지원합니다.');
      return Promise.resolve();
    }
    return navigator.storage.estimate().then(function (estimate) {
      var used = estimate.usage || 0;
      var quota = estimate.quota || 0;
      var usedMb = (used / 1024 / 1024).toFixed(1);
      var quotaMb = quota ? Math.round(quota / 1024 / 1024).toLocaleString('ko-KR') : '알 수 없음';
      setHealth('storage', 'success', '정상', usedMb + 'MB 사용 · 최대 ' + quotaMb + 'MB');
    }).catch(function () {
      setHealth('storage', 'success', '사용 가능', 'IndexedDB 로컬 저장을 지원합니다.');
    });
  }

  function offlineStatus() {
    if (!('serviceWorker' in navigator)) {
      setHealth('offline', 'warning', '제한됨', 'Service Worker를 지원하지 않는 브라우저예요.');
      return;
    }
    if (!window.isSecureContext) {
      setHealth('offline', 'warning', 'Live Server 필요', 'localhost 또는 HTTPS에서 오프라인 기능이 켜집니다.');
      return;
    }
    if (navigator.serviceWorker.controller) {
      setHealth('offline', 'success', '준비 완료', '설치 후 저장된 화면을 오프라인에서 열 수 있어요.');
    } else {
      setHealth('offline', 'warning', '준비 중', '첫 실행 후 한 번 새로고침하면 활성화됩니다.');
    }
  }

  function runDiagnostics(silent) {
    if (diagnosticsRunning) return;
    diagnosticsRunning = true;
    var button = sections && sections.querySelector('[data-run-diagnostics]');
    if (button) {
      button.disabled = true;
      button.textContent = '확인 중…';
    }

    var compatible = supportSummary();
    setHealth('browser', compatible ? 'success' : 'warning', compatible ? '호환됨' : '일부 제한', browserName() + ' · 핵심 기능 ' + (compatible ? '사용 가능' : '확인 필요'));
    setHealth('network', navigator.onLine ? 'success' : 'warning', navigator.onLine ? '온라인' : '오프라인', navigator.onLine ? '업데이트와 설치 기능을 사용할 수 있어요.' : '저장된 할 일은 계속 사용할 수 있어요.');
    offlineStatus();

    storageStatus().finally(function () {
      diagnosticsRunning = false;
      var currentButton = sections && sections.querySelector('[data-run-diagnostics]');
      if (currentButton) {
        currentButton.disabled = false;
        currentButton.textContent = '상태 다시 확인';
      }
      var meta = document.getElementById('releaseMeta');
      if (meta) meta.textContent = '마지막 확인 ' + new Intl.DateTimeFormat('ko-KR', { hour: '2-digit', minute: '2-digit' }).format(new Date()) + ' · v' + APP_VERSION;
      if (!silent) showNotice('앱 상태 점검을 완료했어요.');
    });

    if ('serviceWorker' in navigator && window.isSecureContext) {
      navigator.serviceWorker.getRegistration().then(function (registration) {
        if (registration) return registration.update();
        return null;
      }).catch(function () {});
    }
  }

  function showUpdate(worker) {
    waitingWorker = worker || waitingWorker;
    if (updateBanner) updateBanner.hidden = false;
    var settingsButton = sections && sections.querySelector('[data-apply-waiting-update]');
    if (settingsButton) settingsButton.hidden = false;
  }

  function applyWaitingUpdate() {
    if (!waitingWorker) {
      showNotice('현재 적용할 새 버전이 없어요.');
      return;
    }
    waitingWorker.postMessage({ type: 'SKIP_WAITING' });
  }

  function observeServiceWorker() {
    if (!('serviceWorker' in navigator) || !window.isSecureContext) return;
    navigator.serviceWorker.ready.then(function (registration) {
      if (registration.waiting) showUpdate(registration.waiting);
      registration.addEventListener('updatefound', function () {
        var worker = registration.installing;
        if (!worker) return;
        worker.addEventListener('statechange', function () {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) showUpdate(worker);
        });
      });
    }).catch(function () {});

    navigator.serviceWorker.addEventListener('controllerchange', function () {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
  }

  function formSnapshot() {
    if (!form) return '';
    return Array.prototype.map.call(form.elements, function (field) {
      if (!field.name && !field.id) return '';
      if (field.type === 'checkbox' || field.type === 'radio') return (field.name || field.id) + ':' + field.checked;
      return (field.name || field.id) + ':' + field.value;
    }).join('|');
  }

  function updateDirtyState() {
    if (!modal || !modal.classList.contains('is-open')) {
      formDirty = false;
      return;
    }
    formDirty = formSnapshot() !== formBaseline;
  }

  function confirmDiscard() {
    if (!formDirty) return true;
    var discard = window.confirm('작성 중인 내용이 저장되지 않았어요. 닫을까요?');
    if (discard) formDirty = false;
    return discard;
  }

  function checkDataIntegrity() {
    if (!('indexedDB' in window)) {
      showNotice('이 브라우저에서는 저장소 검사를 실행할 수 없어요.');
      return;
    }
    var request = indexedDB.open('oneul-todo-db');
    request.onerror = function () {
      showNotice('데이터 저장소를 확인하지 못했어요.');
    };
    request.onsuccess = function () {
      var database = request.result;
      if (!database.objectStoreNames.contains('tasks')) {
        database.close();
        showNotice('저장된 할 일이 아직 없어요.');
        return;
      }
      var transaction = database.transaction('tasks', 'readonly');
      var getAll = transaction.objectStore('tasks').getAll();
      getAll.onerror = function () {
        database.close();
        showNotice('데이터 내용을 읽지 못했어요.');
      };
      getAll.onsuccess = function () {
        var items = getAll.result || [];
        var ids = {};
        var issues = items.filter(function (item) {
          var invalid = !item || typeof item.id !== 'string' || !item.id || typeof item.title !== 'string' || !item.title.trim() || ids[item.id];
          if (item && item.id) ids[item.id] = true;
          return invalid;
        });
        database.close();
        showNotice(issues.length ? issues.length + '개의 데이터에서 확인이 필요해요. 먼저 JSON 백업을 권장해요.' : items.length + '개의 할 일 데이터가 모두 정상이에요.');
      };
    };
  }

  if (sections) {
    var sectionsObserver = new MutationObserver(function () {
      if (mountReleaseStatus()) runDiagnostics(true);
    });
    sectionsObserver.observe(sections, { childList: true });
  }

  if (modal && form) {
    var modalObserver = new MutationObserver(function () {
      if (modal.classList.contains('is-open')) {
        window.setTimeout(function () {
          formBaseline = formSnapshot();
          formDirty = false;
        }, 0);
      } else {
        formDirty = false;
      }
    });
    modalObserver.observe(modal, { attributes: true, attributeFilter: ['class'] });

    form.addEventListener('input', updateDirtyState);
    form.addEventListener('change', updateDirtyState);
    form.addEventListener('submit', function () {
      formDirty = false;
    }, true);

    if (formError) {
      new MutationObserver(function () {
        if (formError.textContent.trim()) updateDirtyState();
      }).observe(formError, { childList: true, characterData: true, subtree: true });
    }

    document.addEventListener('click', function (event) {
      var closeButton = event.target.closest('[data-close-modal]');
      var backdrop = event.target === modal;
      if ((closeButton || backdrop) && !confirmDiscard()) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }, true);

    window.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && modal.classList.contains('is-open') && !confirmDiscard()) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }, true);

    window.addEventListener('beforeunload', function (event) {
      if (!formDirty) return;
      event.preventDefault();
      event.returnValue = '';
    });
  }

  document.addEventListener('click', function (event) {
    if (event.target.closest('[data-run-diagnostics]')) runDiagnostics(false);
    if (event.target.closest('[data-integrity-check]')) checkDataIntegrity();
    if (event.target.closest('[data-apply-waiting-update]')) applyWaitingUpdate();
  });

  if (applyUpdateButton) applyUpdateButton.addEventListener('click', applyWaitingUpdate);
  if (dismissUpdateButton) dismissUpdateButton.addEventListener('click', function () { updateBanner.hidden = true; });

  window.addEventListener('online', function () {
    if (document.querySelector('[data-release-status]')) runDiagnostics(true);
  });
  window.addEventListener('offline', function () {
    if (document.querySelector('[data-release-status]')) runDiagnostics(true);
  });

  window.addEventListener('error', function (event) {
    if (!event.error) return;
    console.error('[오늘할일 v' + APP_VERSION + ']', event.error);
    showNotice('예기치 않은 오류가 발생했어요. 입력 내용은 유지하고 다시 시도해주세요.');
  });

  window.addEventListener('unhandledrejection', function (event) {
    console.error('[오늘할일 v' + APP_VERSION + ']', event.reason);
    showNotice('작업을 마치지 못했어요. 네트워크와 저장소 상태를 확인해주세요.');
  });

  observeServiceWorker();
  if (mountReleaseStatus()) runDiagnostics(true);
})();
