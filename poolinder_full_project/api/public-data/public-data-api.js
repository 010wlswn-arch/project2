
/**
 * 공공데이터 API 어댑터
 * API마다 응답 필드명이 다르기 때문에 normalizePublicPoolData()에서 필요한 데이터만 선택합니다.
 */
window.PublicDataAPI = (function(){
  "use strict";

  function normalizePublicPoolData(items=[]){
    return items.map((item,index)=>({
      id: String(item.id || item.facilityId || `api-${index}`),
      name: {
        ko: item.name || item.facilityName || "이름 미제공",
        en: item.name || item.facilityName || "Pool",
        ja: item.name || item.facilityName || "プール",
        zh: item.name || item.facilityName || "游泳馆"
      },
      region: item.region || item.city || "",
      district: item.district || "",
      address: item.address || item.roadAddress || "",
      type: item.type || "실내",
      poolLength: Number(item.poolLength || 25),
      lanes: Number(item.lanes || 0),
      openToday: item.openToday !== false,
      parking: Boolean(item.parking),
      kidsPool: Boolean(item.kidsPool),
      phone: item.phone || "",
      hours: item.hours || "",
      fee: item.fee || "",
      latitude: Number(item.latitude || item.lat || 0),
      longitude: Number(item.longitude || item.lng || 0),
      image: item.image || "./images/pools/pool-1.svg",
      notice: item.notice || ""
    }));
  }

  async function fetchPools(){
    const config = window.PUBLIC_DATA_CONFIG;
    if(!config || !config.enabled || !config.endpoint){
      return { ok:false, reason:"disabled", data:window.POOL_DATA };
    }

    const url = new URL(config.endpoint);
    url.searchParams.set("serviceKey", config.serviceKey);
    url.searchParams.set("numOfRows", String(config.pageSize || 100));
    url.searchParams.set("type", "json");

    const response = await fetch(url.toString());
    if(!response.ok) throw new Error(`HTTP ${response.status}`);

    const json = await response.json();

    // API 응답 구조에 맞게 아래 items 추출 부분만 수정하면 됩니다.
    const items =
      json?.response?.body?.items?.item ||
      json?.response?.body?.items ||
      json?.items ||
      [];

    const normalized = normalizePublicPoolData(Array.isArray(items) ? items : [items]);
    return { ok:true, reason:"api", data:normalized };
  }

  return { fetchPools, normalizePublicPoolData };
})();
