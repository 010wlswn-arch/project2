
document.addEventListener("DOMContentLoaded",()=>{
  const icons={"축구장":"⚽","야구장":"⚾","테니스장":"🎾","생활체육관":"🏸","수영장":"🏊","게이트볼장":"🥌","빙상장":"⛸️","승마장":"🐎","골프연습장":"⛳","국궁장":"🏹","기타 체육시설":"🏟️"};
  function render(){
    const stats=(window.FACILITY_TYPE_STATS||[]).filter(x=>x.count>0).sort((a,b)=>b.count-a.count).slice(0,8);
    document.querySelector("#homeCategories").innerHTML=stats.map(x=>`<a class="category-card card" href="./facilities.html?type=${encodeURIComponent(x.type)}"><div class="category-icon">${icons[x.type]||"🏟️"}</div><h3>${SportsFinder.escapeHtml(x.type)}</h3><p>2021 public facility data</p><strong>${x.count.toLocaleString()}곳</strong></a>`).join("");
    document.querySelector("#homeActivities").innerHTML=(window.ACTIVITY_CATALOG||[]).slice(0,6).map(a=>`<article class="activity-card card"><div class="icon">${a.icon}</div><h3>${SportsFinder.escapeHtml(a.sport)}</h3><p>${a.facilityTypes.map(SportsFinder.escapeHtml).join(" · ")}</p><ul>${a.examples.map(e=>`<li class="tag">${SportsFinder.escapeHtml(e)}</li>`).join("")}</ul></article>`).join("");
  }
  document.querySelector("#homeSearch").addEventListener("submit",e=>{e.preventDefault();const q=document.querySelector("#homeKeyword").value.trim();if(!q){SportsFinder.toast(SportsFinder.t("tryAgain"),"error");return;}location.href=`./facilities.html?q=${encodeURIComponent(q)}`});
  document.addEventListener("sportsfinder:languageChanged",render);render();
});
