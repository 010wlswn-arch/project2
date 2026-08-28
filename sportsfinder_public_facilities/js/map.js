
document.addEventListener("DOMContentLoaded",()=>{
  const data=(window.PUBLIC_FACILITIES||[]).slice(0,500),type=document.querySelector("#mapType"),list=document.querySelector("#mapList"),message=document.querySelector("#mapMessage"),config=window.KAKAO_MAP_CONFIG||{};
  type.innerHTML=`<option value="">${SportsFinder.t("all")}</option>`+[...new Set(data.map(x=>x.type))].sort().map(v=>`<option>${SportsFinder.escapeHtml(v)}</option>`).join("");
  function renderList(){const rows=data.filter(x=>!type.value||x.type===type.value).slice(0,80);list.innerHTML=rows.map(x=>`<button class="map-item" type="button"><strong>${SportsFinder.escapeHtml(x.name)}</strong><p>${SportsFinder.escapeHtml([x.province,x.city,x.type].filter(Boolean).join(" · "))}</p></button>`).join("")}
  type.addEventListener("change",renderList);renderList();
  if(!config.javascriptKey||config.javascriptKey.includes("여기에_")) return;
  const script=document.createElement("script");script.src=`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(config.javascriptKey)}&autoload=false`;script.onload=()=>kakao.maps.load(()=>{new kakao.maps.Map(document.querySelector("#kakaoMap"),{center:new kakao.maps.LatLng(36.5,127.8),level:13});message.classList.add("hidden")});script.onerror=()=>SportsFinder.toast(SportsFinder.t("mapMissing"),"error");document.head.appendChild(script);
});
