
(function(){
  "use strict";

  const STORAGE_KEYS = {
    language: "poolinderLanguage",
    favorites: "poolinderFavorites"
  };

  function getLanguage(){
    return localStorage.getItem(STORAGE_KEYS.language) || "ko";
  }

  function getText(key){
    const lang = getLanguage();
    return (window.TRANSLATIONS[lang] && window.TRANSLATIONS[lang][key]) ||
           (window.TRANSLATIONS.ko && window.TRANSLATIONS.ko[key]) || key;
  }

  /** 화면의 data-i18n 문구를 선택 언어로 변경 */
  function applyLanguage(lang){
    if(!window.TRANSLATIONS[lang]) return;
    localStorage.setItem(STORAGE_KEYS.language, lang);
    document.documentElement.lang = lang === "zh" ? "zh-CN" : lang;

    document.querySelectorAll("[data-i18n]").forEach((element)=>{
      const key = element.dataset.i18n;
      const value = window.TRANSLATIONS[lang][key];
      if(value) element.textContent = value;
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((element)=>{
      const key = element.dataset.i18nPlaceholder;
      const value = window.TRANSLATIONS[lang][key];
      if(value) element.placeholder = value;
    });

    document.querySelectorAll(".lang-button").forEach((button)=>{
      button.classList.toggle("is-active", button.dataset.lang === lang);
    });

    document.dispatchEvent(new CustomEvent("poolinder:languageChanged", { detail:{ lang } }));
  }

  /** 공통 토스트 메시지 */
  function showToast(message, type="info"){
    const toast = document.querySelector("#toast");
    if(!toast) return;
    toast.textContent = message;
    toast.className = `toast is-visible ${type === "success" ? "is-success" : type === "error" ? "is-error" : ""}`.trim();
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(()=> toast.className = "toast", 2400);
  }

  function getFavorites(){
    try{
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.favorites)) || [];
    }catch{
      return [];
    }
  }

  function isFavorite(poolId){
    return getFavorites().includes(poolId);
  }

  /** 즐겨찾기 추가/삭제 */
  function toggleFavorite(poolId){
    const favorites = getFavorites();
    const exists = favorites.includes(poolId);
    const next = exists ? favorites.filter(id=>id !== poolId) : [...favorites, poolId];
    localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(next));
    showToast(getText(exists ? "removedFavorite" : "successFavorite"), "success");
    document.dispatchEvent(new CustomEvent("poolinder:favoritesChanged"));
    return !exists;
  }

  function clearFavorites(){
    localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify([]));
    showToast(getText("clearedFavorites"), "success");
    document.dispatchEvent(new CustomEvent("poolinder:favoritesChanged"));
  }

  function getPoolName(pool){
    return pool.name[getLanguage()] || pool.name.ko;
  }

  function escapeHtml(value=""){
    return String(value).replace(/[&<>"']/g, char => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
    }[char]));
  }

  /** 수영장 카드 HTML 생성 */
  function createPoolCard(pool){
    const favorite = isFavorite(pool.id);
    return `
      <article class="pool-card card" data-pool-id="${escapeHtml(pool.id)}">
        <div class="pool-photo">
          <img src="${escapeHtml(pool.image)}" alt="${escapeHtml(getPoolName(pool))}" onerror="this.style.display='none';this.nextElementSibling.classList.remove('hidden')">
          <div class="pool-photo-fallback hidden" aria-hidden="true">
            <svg viewBox="0 0 260 120"><rect x="10" y="45" width="240" height="65" rx="10" fill="#168fb0"/><path d="M20 65H240M20 85H240" stroke="#fff" stroke-width="4"/><path d="M45 65H210" stroke="#ef7c82" stroke-width="3"/></svg>
          </div>
        </div>
        <div class="pool-card-body">
          <div class="pool-card-top">
            <div>
              <span class="badge">${escapeHtml(pool.region)}</span>
              <h3>${escapeHtml(getPoolName(pool))}</h3>
              <p>${escapeHtml(pool.address)}</p>
            </div>
            <button class="favorite-button ${favorite ? "is-favorite" : ""}" type="button" data-favorite="${escapeHtml(pool.id)}" aria-label="${getText(favorite ? "removeFavorite" : "addFavorite")}">${favorite ? "♥" : "♡"}</button>
          </div>
          <div class="pool-meta">
            <span>${pool.poolLength}m</span>
            <span>${pool.lanes} lanes</span>
            <span>${escapeHtml(pool.type)}</span>
            <span>${getText(pool.openToday ? "open" : "closed")}</span>
          </div>
          <div class="card-actions">
            <a class="button button--ghost button--small" href="./detail.html?id=${encodeURIComponent(pool.id)}">${getText("details")}</a>
            <a class="button button--primary button--small" href="./map.html?id=${encodeURIComponent(pool.id)}">${getText("mapView")}</a>
          </div>
        </div>
      </article>`;
  }

  function bindFavoriteButtons(root=document){
    root.querySelectorAll("[data-favorite]").forEach((button)=>{
      button.addEventListener("click", ()=>{
        const active = toggleFavorite(button.dataset.favorite);
        button.classList.toggle("is-favorite", active);
        button.textContent = active ? "♥" : "♡";
        button.setAttribute("aria-label", getText(active ? "removeFavorite" : "addFavorite"));
      });
    });
  }

  /** 현재 위치 요청 */
  function requestNearby(){
    if(!navigator.geolocation){
      showToast(getText("locationError"), "error");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      position=>{
        sessionStorage.setItem("poolinderLocation", JSON.stringify({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }));
        showToast(getText("locationSuccess"), "success");
        window.location.href = "./map.html?nearby=1";
      },
      ()=> showToast(getText("locationError"), "error"),
      { enableHighAccuracy:true, timeout:7000 }
    );
  }

  function initCommon(){
    document.querySelectorAll(".lang-button").forEach(button=>{
      button.addEventListener("click", ()=>applyLanguage(button.dataset.lang));
    });

    const mobileButton = document.querySelector(".mobile-menu-button");
    const nav = document.querySelector(".main-nav");
    if(mobileButton && nav){
      mobileButton.addEventListener("click", ()=>{
        const isOpen = nav.classList.toggle("is-open");
        mobileButton.setAttribute("aria-expanded", String(isOpen));
      });
    }

    document.querySelectorAll("[data-nearby]").forEach(button=>{
      button.addEventListener("click", requestNearby);
    });

    const page = document.body.dataset.page;
    const currentNav = document.querySelector(`[data-nav="${page}"]`);
    if(currentNav) currentNav.classList.add("is-active");

    applyLanguage(getLanguage());
  }

  window.Poolinder = {
    getLanguage,getText,applyLanguage,showToast,getFavorites,isFavorite,toggleFavorite,clearFavorites,
    getPoolName,createPoolCard,bindFavoriteButtons,requestNearby,escapeHtml
  };

  document.addEventListener("DOMContentLoaded", initCommon);
})();
