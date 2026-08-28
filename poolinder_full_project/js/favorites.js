
document.addEventListener("DOMContentLoaded",()=>{
  const grid = document.querySelector("#favoriteGrid");
  const count = document.querySelector("#favoriteCount");
  const clearButton = document.querySelector("#clearFavorites");

  function render(){
    const favoriteIds = Poolinder.getFavorites();
    const pools = window.POOL_DATA.filter(pool=>favoriteIds.includes(pool.id));
    count.textContent = pools.length;

    if(!pools.length){
      grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><strong>${Poolinder.getText("favoritesEmpty")}</strong><a class="button button--primary" style="margin-top:16px" href="./pools.html">${Poolinder.getText("navPools")}</a></div>`;
      clearButton.disabled = true;
      return;
    }

    clearButton.disabled = false;
    grid.innerHTML = pools.map(Poolinder.createPoolCard).join("");
    Poolinder.bindFavoriteButtons(grid);
  }

  clearButton.addEventListener("click",()=>{
    Poolinder.clearFavorites();
    render();
  });

  document.addEventListener("poolinder:favoritesChanged",render);
  document.addEventListener("poolinder:languageChanged",render);
  render();
});
