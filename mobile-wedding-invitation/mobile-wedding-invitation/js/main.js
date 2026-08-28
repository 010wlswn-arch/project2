(function () {
  "use strict";

  const config = window.WEDDING_CONFIG || {};
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  function showToast(message) {
    const toast = $("#toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  async function copyText(text, successMessage = "복사되었습니다.") {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const helper = document.createElement("textarea");
        helper.value = text;
        helper.setAttribute("readonly", "");
        helper.style.position = "fixed";
        helper.style.opacity = "0";
        document.body.appendChild(helper);
        helper.select();
        if (!document.execCommand("copy")) throw new Error("copy failed");
        helper.remove();
      }
      showToast(successMessage);
    } catch (error) {
      console.error("복사 오류:", error);
      showToast("복사하지 못했어요. 길게 눌러 직접 복사해 주세요.");
    }
  }

  function initReveal() {
    const items = $$(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -28px" });
    items.forEach((item) => observer.observe(item));
  }

  function initImageFallback() {
    $$('img').forEach((image) => {
      image.addEventListener("error", () => {
        const replacement = document.createElement("div");
        replacement.className = image.className + " empty-state";
        replacement.setAttribute("role", "img");
        replacement.setAttribute("aria-label", "사진 준비 중");
        replacement.textContent = "사진 준비 중";
        image.replaceWith(replacement);
      }, { once: true });
    });
  }

  function initCountdown() {
    const countdown = $("#countdown");
    if (!countdown || !config.weddingDate) return;
    const target = new Date(config.weddingDate).getTime();
    if (Number.isNaN(target)) {
      console.error("결혼식 날짜 형식이 올바르지 않습니다.");
      countdown.innerHTML = '<p class="section-copy">날짜 정보를 확인해 주세요.</p>';
      return;
    }
    const elements = {
      days: $("[data-time=days]"), hours: $("[data-time=hours]"),
      minutes: $("[data-time=minutes]"), seconds: $("[data-time=seconds]")
    };
    const update = () => {
      const difference = Math.max(0, target - Date.now());
      const values = {
        days: Math.floor(difference / 86400000),
        hours: Math.floor((difference / 3600000) % 24),
        minutes: Math.floor((difference / 60000) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
      Object.entries(values).forEach(([key, value]) => {
        const next = String(value).padStart(2, "0");
        if (elements[key] && elements[key].textContent !== next) {
          elements[key].classList.add("tick");
          elements[key].textContent = next;
          setTimeout(() => elements[key]?.classList.remove("tick"), 180);
        }
      });
      if (difference === 0) {
        const message = $("#countdown-message");
        if (message) message.textContent = "소중한 축복에 감사드립니다.";
        clearInterval(initCountdown.timer);
      }
    };
    update();
    initCountdown.timer = setInterval(update, 1000);
    document.addEventListener("visibilitychange", () => !document.hidden && update());
  }

  function initCopyButtons() {
    $$('[data-copy]').forEach((button) => button.addEventListener("click", () => {
      copyText(button.dataset.copy, button.dataset.copyMessage || "복사되었습니다.");
    }));
  }

  function initAccounts() {
    $$('[data-account-toggle]').forEach((button) => button.addEventListener("click", () => {
      const panel = document.getElementById(button.getAttribute("aria-controls"));
      const opened = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!opened));
      panel?.classList.toggle("is-open", !opened);
    }));
  }

  function initGallery() {
    const modal = $("#lightbox");
    const modalImage = $("#lightbox-image");
    if (!modal || !modalImage) return;
    const close = () => { modal.classList.remove("is-open"); modal.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; };
    $$('[data-lightbox]').forEach((button) => button.addEventListener("click", () => {
      modalImage.src = button.dataset.lightbox;
      modalImage.alt = button.dataset.alt || "확대된 웨딩 사진";
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      $(".lightbox-close", modal)?.focus();
    }));
    $(".lightbox-close", modal)?.addEventListener("click", close);
    modal.addEventListener("click", (event) => event.target === modal && close());
    document.addEventListener("keydown", (event) => event.key === "Escape" && close());
  }

  function initShare() {
    $$('[data-share]').forEach((button) => button.addEventListener("click", async () => {
      const data = { title: "민혁 그리고 서영, 결혼합니다", text: "2026년 10월 17일 오후 2시", url: location.href };
      try {
        if (navigator.share) await navigator.share(data);
        else await copyText(location.href, "청첩장 주소를 복사했어요.");
      } catch (error) {
        if (error.name !== "AbortError") console.error("공유 오류:", error);
      }
    }));
  }

  function initKakaoShare() {
    const button = $("#kakao-share-button");
    if (!button) return;
    button.addEventListener("click", () => {
      const key = config.kakaoJavaScriptKey;
      if (!key || key.includes("여기에_")) {
        showToast("js/config.js에 카카오 JavaScript 키를 입력해 주세요.");
        return;
      }
      try {
        if (!window.Kakao) throw new Error("Kakao SDK not loaded");
        if (!Kakao.isInitialized()) Kakao.init(key);
        Kakao.Share.sendDefault({
          objectType: "feed",
          content: {
            title: "민혁 그리고 서영, 결혼합니다",
            description: "2026년 10월 17일 토요일 오후 2시",
            imageUrl: new URL("./images/main_wedding.webp", location.href).href,
            link: { mobileWebUrl: location.href, webUrl: location.href }
          },
          buttons: [{ title: "청첩장 보기", link: { mobileWebUrl: location.href, webUrl: location.href } }]
        });
      } catch (error) {
        console.error("카카오 공유 오류:", error);
        showToast("카카오 키와 등록 도메인을 확인해 주세요.");
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initReveal(); initImageFallback(); initCountdown(); initCopyButtons();
    initAccounts(); initGallery(); initShare(); initKakaoShare();
  });

  window.WeddingApp = { showToast, copyText };
})();
