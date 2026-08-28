
document.addEventListener("DOMContentLoaded",()=>{
  const root = document.querySelector("#detailRoot");
  const params = new URLSearchParams(location.search);
  const poolId = params.get("id") || window.POOL_DATA[0].id;

  function render(){
    const pool = window.POOL_DATA.find(item=>item.id === poolId);
    if(!pool){
      root.innerHTML = `<div class="empty-state"><strong>${Poolinder.getText("noResults")}</strong><a href="./pools.html" class="button button--primary" style="margin-top:16px">${Poolinder.getText("backToList")}</a></div>`;
      return;
    }

    const favorite = Poolinder.isFavorite(pool.id);
    root.innerHTML = `
      <div class="detail-grid">
        <div class="detail-gallery card">
          <div class="pool-photo">
            <img src="${Poolinder.escapeHtml(pool.image)}" alt="${Poolinder.escapeHtml(Poolinder.getPoolName(pool))}">
          </div>
        </div>
        <article class="detail-info card">
          <span class="badge">${Poolinder.escapeHtml(pool.region)} · ${Poolinder.escapeHtml(pool.district)}</span>
          <h1>${Poolinder.escapeHtml(Poolinder.getPoolName(pool))}</h1>
          <p class="detail-address">${Poolinder.escapeHtml(pool.address)}</p>
          <div class="detail-actions">
            <button class="button button--primary" type="button" data-favorite="${Poolinder.escapeHtml(pool.id)}">${favorite ? "♥ " + Poolinder.getText("removeFavorite") : "♡ " + Poolinder.getText("addFavorite")}</button>
            <a class="button button--ghost" href="./map.html?id=${encodeURIComponent(pool.id)}">${Poolinder.getText("mapView")}</a>
          </div>
          <dl class="info-table">
            <div class="info-row"><dt>${Poolinder.getText("detailHours")}</dt><dd>${Poolinder.escapeHtml(pool.hours)}</dd></div>
            <div class="info-row"><dt>${Poolinder.getText("detailFee")}</dt><dd>${Poolinder.escapeHtml(pool.fee)}</dd></div>
            <div class="info-row"><dt>${Poolinder.getText("detailPhone")}</dt><dd>${Poolinder.escapeHtml(pool.phone)}</dd></div>
            <div class="info-row"><dt>${Poolinder.getText("detailAddress")}</dt><dd>${Poolinder.escapeHtml(pool.address)}</dd></div>
            <div class="info-row"><dt>${Poolinder.getText("detailSpec")}</dt><dd>${pool.poolLength}m · ${pool.lanes} lanes · ${Poolinder.escapeHtml(pool.type)}</dd></div>
            <div class="info-row"><dt>${Poolinder.getText("detailParking")}</dt><dd>${Poolinder.getText(pool.parking ? "yes" : "no")}</dd></div>
          </dl>
          <div class="notice-banner"><strong>${Poolinder.getText("facilityNotice")}</strong><br>${Poolinder.escapeHtml(pool.notice)}</div>
        </article>
      </div>`;
    const favoriteButton = root.querySelector("[data-favorite]");
    favoriteButton.addEventListener("click",()=>{
      Poolinder.toggleFavorite(pool.id);
      render();
    });
  }

  document.addEventListener("poolinder:languageChanged",render);
  render();
});
