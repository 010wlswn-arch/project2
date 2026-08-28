
document.addEventListener("DOMContentLoaded", ()=>{
  const featuredContainer = document.querySelector("#featuredPools");
  const homeSearchForm = document.querySelector("#homeSearchForm");
  const homeSearchInput = document.querySelector("#homeSearchInput");

  function renderFeatured(){
    const pools = window.POOL_DATA.slice(0,3);
    featuredContainer.innerHTML = pools.map(Poolinder.createPoolCard).join("");
    Poolinder.bindFavoriteButtons(featuredContainer);
  }

  homeSearchForm.addEventListener("submit",(event)=>{
    event.preventDefault();
    const keyword = homeSearchInput.value.trim();
    if(!keyword){
      Poolinder.showToast(Poolinder.getText("tryReset"),"error");
      homeSearchInput.focus();
      return;
    }
    window.location.href = `./pools.html?q=${encodeURIComponent(keyword)}`;
  });

  document.querySelectorAll("[data-quick-search]").forEach(button=>{
    button.addEventListener("click",()=>{
      const value = button.dataset.quickSearch;
      window.location.href = `./pools.html?q=${encodeURIComponent(value)}`;
    });
  });

  document.addEventListener("poolinder:languageChanged",renderFeatured);
  renderFeatured();
});
