
(function(){
  "use strict";
  const LANG_KEY = "sportsFinderLanguage";
  const getLang = () => localStorage.getItem(LANG_KEY) || "ko";
  const t = key => (window.TRANSLATIONS[getLang()] || window.TRANSLATIONS.ko)[key] || key;

  function applyLanguage(lang){
    if(!window.TRANSLATIONS[lang]) return;
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = lang === "zh" ? "zh-CN" : lang;
    document.querySelectorAll("[data-i18n]").forEach(el=>{
      const value = window.TRANSLATIONS[lang][el.dataset.i18n];
      if(value) el.textContent = value;
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el=>{
      const value = window.TRANSLATIONS[lang][el.dataset.i18nPlaceholder];
      if(value) el.placeholder = value;
    });
    document.querySelectorAll(".lang-btn").forEach(btn=>btn.classList.toggle("is-active",btn.dataset.lang===lang));
    document.dispatchEvent(new CustomEvent("sportsfinder:languageChanged",{detail:{lang}}));
  }

  function toast(message,type="info"){
    const el=document.querySelector("#toast");
    if(!el) return;
    el.textContent=message;
    el.className=`toast is-visible toast--${type}`;
    clearTimeout(toast.timer);
    toast.timer=setTimeout(()=>el.className="toast",2400);
  }

  function escapeHtml(value=""){
    return String(value).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  }

  function requestLocation(){
    if(!navigator.geolocation){ toast(t("locationError"),"error"); return; }
    navigator.geolocation.getCurrentPosition(
      pos=>{
        sessionStorage.setItem("sportsFinderLocation",JSON.stringify({lat:pos.coords.latitude,lng:pos.coords.longitude}));
        toast(t("locationSuccess"),"success");
        setTimeout(()=>location.href="./map.html?nearby=1",500);
      },
      ()=>toast(t("locationError"),"error"),
      {enableHighAccuracy:true,timeout:7000}
    );
  }

  function init(){
    document.querySelectorAll(".lang-btn").forEach(btn=>btn.addEventListener("click",()=>applyLanguage(btn.dataset.lang)));
    document.querySelectorAll("[data-nearby]").forEach(btn=>btn.addEventListener("click",requestLocation));

    const menuBtn=document.querySelector(".mobile-menu-btn");
    const nav=document.querySelector(".main-nav");
    if(menuBtn && nav){
      menuBtn.addEventListener("click",()=>{
        const open=nav.classList.toggle("is-open");
        menuBtn.setAttribute("aria-expanded",String(open));
      });
    }

    const page=document.body.dataset.page;
    const active=document.querySelector(`[data-nav="${page}"]`);
    if(active) active.classList.add("is-active");
    applyLanguage(getLang());
  }

  window.SportsFinder={getLang,t,applyLanguage,toast,escapeHtml,requestLocation};
  document.addEventListener("DOMContentLoaded",init);
})();
