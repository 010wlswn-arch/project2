
document.addEventListener("DOMContentLoaded", async ()=>{
  const elements = {
    keyword: document.querySelector("#filterKeyword"),
    region: document.querySelector("#filterRegion"),
    type: document.querySelector("#filterType"),
    length: document.querySelector("#filterLength"),
    lanes: document.querySelector("#filterLanes"),
    form: document.querySelector("#filterForm"),
    reset: document.querySelector("#resetFilters"),
    list: document.querySelector("#poolResults"),
    count: document.querySelector("#resultCount"),
    status: document.querySelector("#apiStatus")
  };

  let allPools = window.POOL_DATA;

  function fillRegionOptions(){
    const regions = [...new Set(allPools.map(pool=>pool.region).filter(Boolean))].sort();
    const current = elements.region.value;
    elements.region.innerHTML = `<option value="">${Poolinder.getText("allRegions")}</option>` +
      regions.map(region=>`<option value="${Poolinder.escapeHtml(region)}">${Poolinder.escapeHtml(region)}</option>`).join("");
    elements.region.value = current;
  }

  /** 검색 조건에 필요한 데이터만 선택하여 필터링 */
  function getFilteredPools(){
    const keyword = elements.keyword.value.trim().toLowerCase();
    const region = elements.region.value;
    const type = elements.type.value;
    const length = elements.length.value;
    const lanes = elements.lanes.value;

    return allPools.filter(pool=>{
      const searchable = [
        Poolinder.getPoolName(pool),
        pool.region,
        pool.district,
        pool.address
      ].join(" ").toLowerCase();

      const keywordMatch = !keyword || searchable.includes(keyword);
      const regionMatch = !region || pool.region === region;
      const typeMatch = !type || pool.type === type;
      const lengthMatch = !length || pool.poolLength === Number(length);
      const laneMatch = !lanes || pool.lanes >= Number(lanes);

      return keywordMatch && regionMatch && typeMatch && lengthMatch && laneMatch;
    });
  }

  function render(){
    const filtered = getFilteredPools();
    elements.count.textContent = filtered.length;

    if(!filtered.length){
      elements.list.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1">
          <strong>${Poolinder.getText("noResults")}</strong>
          <p>${Poolinder.getText("tryReset")}</p>
        </div>`;
      return;
    }

    elements.list.innerHTML = filtered.map(Poolinder.createPoolCard).join("");
    Poolinder.bindFavoriteButtons(elements.list);
  }

  function applyQueryString(){
    const params = new URLSearchParams(location.search);
    elements.keyword.value = params.get("q") || "";
    elements.region.value = params.get("region") || "";
  }

  elements.form.addEventListener("submit",(event)=>{
    event.preventDefault();
    render();
    Poolinder.showToast(Poolinder.getText("searchMessage"),"success");
  });

  elements.reset.addEventListener("click",()=>{
    elements.form.reset();
    render();
  });

  [elements.region,elements.type,elements.length,elements.lanes].forEach(element=>{
    element.addEventListener("change",render);
  });

  document.addEventListener("poolinder:languageChanged",()=>{
    fillRegionOptions();
    render();
  });

  // 공공데이터 API가 활성화되어 있으면 시도하고, 실패 시 기본 배열 데이터 사용
  try{
    elements.status.textContent = Poolinder.getText("apiLoading");
    elements.status.className = "status-box status-box--info";
    const result = await PublicDataAPI.fetchPools();

    if(result.ok && result.data.length){
      allPools = result.data;
      elements.status.textContent = Poolinder.getText("apiSuccess");
      elements.status.className = "status-box status-box--success";
    }else{
      elements.status.classList.add("hidden");
    }
  }catch(error){
    console.error("Public data API error:",error);
    elements.status.textContent = Poolinder.getText("apiError");
    elements.status.className = "status-box status-box--error";
  }

  fillRegionOptions();
  applyQueryString();
  render();
});
