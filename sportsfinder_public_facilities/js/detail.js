
document.addEventListener("DOMContentLoaded",()=>{
  const data=window.PUBLIC_FACILITIES||[],id=new URLSearchParams(location.search).get("id"),x=data.find(v=>v.id===id)||data[0],root=document.querySelector("#detailRoot");
  const icon={"축구장":"⚽","야구장":"⚾","테니스장":"🎾","수영장":"🏊","생활체육관":"🏸","구기체육관":"🏀","빙상장":"⛸️"}[x.type]||"🏟️";
  const row=(k,v)=>`<div class="dl-row"><dt>${SportsFinder.t(k)}</dt><dd>${SportsFinder.escapeHtml(v||"-")}</dd></div>`;
  root.innerHTML=`<div class="detail-grid"><div class="detail-hero-card card">${icon}</div><article class="detail-info card"><span class="tag">${SportsFinder.escapeHtml(x.type)}</span><h1>${SportsFinder.escapeHtml(x.name)}</h1><p class="section-copy">${SportsFinder.escapeHtml([x.province,x.city].filter(Boolean).join(" "))}</p><dl class="dl">${row("address",x.address)}${row("manager",x.manager)}${row("owner",x.owner)}${row("indoorOutdoor",x.indoorOutdoor)}${row("area",x.landArea?Number(x.landArea).toLocaleString()+"㎡":"-")}${row("possibleActivities",(x.activities||[]).join(", "))}${row("source","문화체육관광부 전국공공체육시설 현황 (2021년말 기준)")}</dl></article></div>`;
});
