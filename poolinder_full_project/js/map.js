
document.addEventListener("DOMContentLoaded",()=>{
  const regionSelect = document.querySelector("#mapRegion");
  const mapList = document.querySelector("#mapPoolList");
  const placeholder = document.querySelector("#mapPlaceholder");
  const config = window.KAKAO_MAP_CONFIG || {};
  let kakaoMap = null;
  let markers = [];

  function fillRegions(){
    const regions = [...new Set(window.POOL_DATA.map(pool=>pool.region))].sort();
    regionSelect.innerHTML = `<option value="">${Poolinder.getText("allRegions")}</option>` +
      regions.map(region=>`<option value="${Poolinder.escapeHtml(region)}">${Poolinder.escapeHtml(region)}</option>`).join("");
  }

  function getVisiblePools(){
    const region = regionSelect.value;
    return window.POOL_DATA.filter(pool=>!region || pool.region === region);
  }

  function renderList(){
    const pools = getVisiblePools();
    mapList.innerHTML = pools.map(pool=>`
      <button class="map-list-item" type="button" data-map-pool="${Poolinder.escapeHtml(pool.id)}">
        <strong>${Poolinder.escapeHtml(Poolinder.getPoolName(pool))}</strong>
        <p>${Poolinder.escapeHtml(pool.address)} · ${pool.poolLength}m · ${pool.lanes} lanes</p>
      </button>
    `).join("");

    mapList.querySelectorAll("[data-map-pool]").forEach(button=>{
      button.addEventListener("click",()=>{
        mapList.querySelectorAll(".map-list-item").forEach(item=>item.classList.remove("is-selected"));
        button.classList.add("is-selected");
        focusPool(button.dataset.mapPool);
      });
    });
    refreshMarkers();
  }

  function focusPool(poolId){
    const pool = window.POOL_DATA.find(item=>item.id === poolId);
    if(!pool || !kakaoMap || !window.kakao) return;
    const position = new kakao.maps.LatLng(pool.latitude,pool.longitude);
    kakaoMap.panTo(position);
    kakaoMap.setLevel(4);
  }

  function refreshMarkers(){
    if(!kakaoMap || !window.kakao) return;
    markers.forEach(marker=>marker.setMap(null));
    markers = getVisiblePools().map(pool=>{
      const marker = new kakao.maps.Marker({
        map:kakaoMap,
        position:new kakao.maps.LatLng(pool.latitude,pool.longitude)
      });
      const info = new kakao.maps.InfoWindow({
        content:`<div style="padding:10px;font-size:12px;min-width:160px"><strong>${Poolinder.escapeHtml(Poolinder.getPoolName(pool))}</strong><br>${Poolinder.escapeHtml(pool.region)}</div>`
      });
      kakao.maps.event.addListener(marker,"click",()=>info.open(kakaoMap,marker));
      return marker;
    });
  }

  /** 카카오맵 JavaScript SDK를 동적으로 로드 */
  function loadKakaoMap(){
    if(!config.javascriptKey || config.javascriptKey.includes("여기에_")){
      placeholder.classList.remove("hidden");
      return;
    }

    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(config.javascriptKey)}&autoload=false`;
    script.onload = ()=>{
      kakao.maps.load(()=>{
        const center = new kakao.maps.LatLng(config.defaultLatitude,config.defaultLongitude);
        kakaoMap = new kakao.maps.Map(document.querySelector("#kakaoMap"),{
          center,
          level:config.defaultLevel || 8
        });
        placeholder.classList.add("hidden");
        refreshMarkers();

        const params = new URLSearchParams(location.search);
        const requestedId = params.get("id");
        if(requestedId) focusPool(requestedId);
      });
    };
    script.onerror = ()=>{
      placeholder.classList.remove("hidden");
      Poolinder.showToast(Poolinder.getText("mapApiMissing"),"error");
    };
    document.head.appendChild(script);
  }

  regionSelect.addEventListener("change",renderList);

  document.addEventListener("poolinder:languageChanged",()=>{
    fillRegions();
    renderList();
  });

  fillRegions();
  renderList();
  loadKakaoMap();
});
