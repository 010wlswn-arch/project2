
document.addEventListener("DOMContentLoaded",()=>{
  function bars(target,data,labelKey,valueKey,limit=16){const rows=[...data].sort((a,b)=>b[valueKey]-a[valueKey]).slice(0,limit),max=Math.max(...rows.map(x=>x[valueKey]),1);document.querySelector(target).innerHTML=rows.map(x=>`<div class="bar-row"><span>${SportsFinder.escapeHtml(x[labelKey])}</span><div class="bar-track"><div class="bar-fill" style="width:${Math.max(2,x[valueKey]/max*100)}%"></div></div><span class="bar-value">${Number(x[valueKey]).toLocaleString()}</span></div>`).join("")}
  bars("#typeBars",(window.FACILITY_TYPE_STATS||[]).filter(x=>!x.type.includes("합")), "type","count",18);
  bars("#provinceBars",window.PROVINCE_STATS||[],"province","count",17);
});
