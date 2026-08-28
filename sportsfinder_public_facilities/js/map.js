document.addEventListener("DOMContentLoaded",()=>{
  const data=window.PUBLIC_FACILITIES||[];
  const config=window.KAKAO_MAP_CONFIG||{};
  const form=document.querySelector("#mapFilter"),keyword=document.querySelector("#mapKeyword"),province=document.querySelector("#mapProvince"),type=document.querySelector("#mapType"),reset=document.querySelector("#mapReset"),list=document.querySelector("#mapList"),count=document.querySelector("#mapResultCount"),message=document.querySelector("#mapMessage");
  let map=null,geocoder=null,activeMarker=null,infoWindow=null;

  const optionHtml=values=>`<option value="">${SportsFinder.t("all")}</option>`+[...new Set(values.filter(Boolean))].sort().map(v=>`<option value="${SportsFinder.escapeHtml(v)}">${SportsFinder.escapeHtml(v)}</option>`).join("");
  province.innerHTML=optionHtml(data.map(x=>x.province)); type.innerHTML=optionHtml(data.map(x=>x.type));

  function getRows(){const q=keyword.value.trim().toLowerCase();return data.filter(x=>{const text=[x.name,x.province,x.city,x.address,x.type].join(" ").toLowerCase();return(!q||text.includes(q))&&(!province.value||x.province===province.value)&&(!type.value||x.type===type.value)})}
  function renderList(){const rows=getRows();count.textContent=rows.length.toLocaleString();list.innerHTML=rows.slice(0,120).map(x=>`<button class="map-item" type="button" data-id="${x.id}"><strong>${SportsFinder.escapeHtml(x.name)}</strong><p>${SportsFinder.escapeHtml([x.province,x.city,x.type].filter(Boolean).join(" · "))}</p><small>${SportsFinder.escapeHtml(x.address||"주소 정보 없음")}</small></button>`).join("")||`<div class="empty"><strong>${SportsFinder.t("noResults")}</strong><p>${SportsFinder.t("tryAgain")}</p></div>`}

  function focusFacility(facility){
    if(!map||!geocoder){SportsFinder.toast("지도가 아직 준비되지 않았습니다.","error");return}
    const address=facility.address||[facility.province,facility.city,facility.name].filter(Boolean).join(" ");
    if(!address){SportsFinder.toast("시설 주소 정보가 없습니다.","error");return}
    geocoder.addressSearch(address,(result,status)=>{
      if(status!==kakao.maps.services.Status.OK||!result.length){SportsFinder.toast("시설 위치를 찾지 못했습니다. 주소 정보를 확인해 주세요.","error");return}
      const position=new kakao.maps.LatLng(result[0].y,result[0].x);map.setCenter(position);map.setLevel(4);
      if(activeMarker) activeMarker.setMap(null); if(infoWindow) infoWindow.close();
      activeMarker=new kakao.maps.Marker({map,position});
      infoWindow=new kakao.maps.InfoWindow({content:`<div style="padding:12px 14px;min-width:210px;font-size:12px"><strong style="font-size:14px">${SportsFinder.escapeHtml(facility.name)}</strong><br>${SportsFinder.escapeHtml(facility.type)}<br><span style="color:#6e8794">${SportsFinder.escapeHtml(address)}</span></div>`});
      infoWindow.open(map,activeMarker);SportsFinder.toast(`${facility.name} 위치로 이동했습니다.`,"success");
    });
  }

  list.addEventListener("click",e=>{const btn=e.target.closest(".map-item[data-id]");if(!btn)return;document.querySelectorAll(".map-item").forEach(x=>x.classList.remove("is-active"));btn.classList.add("is-active");const facility=data.find(x=>x.id===btn.dataset.id);if(facility)focusFacility(facility)});
  form.addEventListener("submit",e=>{e.preventDefault();renderList();SportsFinder.toast(SportsFinder.t("filterSuccess"),"success")});
  [province,type].forEach(el=>el.addEventListener("change",renderList));
  reset.addEventListener("click",()=>{form.reset();renderList();if(map){map.setCenter(new kakao.maps.LatLng(36.5,127.8));map.setLevel(13)}});
  renderList();

  if(!config.javascriptKey||config.javascriptKey.includes("여기에_"))return;
  const script=document.createElement("script");
  script.src=`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(config.javascriptKey)}&libraries=services&autoload=false`;
  script.onload=()=>kakao.maps.load(()=>{map=new kakao.maps.Map(document.querySelector("#kakaoMap"),{center:new kakao.maps.LatLng(36.5,127.8),level:13});geocoder=new kakao.maps.services.Geocoder();message.classList.add("hidden")});
  script.onerror=()=>SportsFinder.toast(SportsFinder.t("mapMissing"),"error");document.head.appendChild(script);
});
