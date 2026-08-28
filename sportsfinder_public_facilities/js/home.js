
document.addEventListener("DOMContentLoaded",()=>{
  const activityClass=s=>({"축구":"soccer","야구":"baseball","테니스":"tennis","수영":"swim","배드민턴":"badminton","농구":"basketball","탁구":"tabletennis","빙상":"ice","승마":"horse","양궁·국궁":"archery","골프":"golf","생활체육":"fitness"}[s]||"sports");
  const icons={"축구장":"⚽","야구장":"⚾","테니스장":"🎾","생활체육관":"🏸","수영장":"🏊","게이트볼장":"🥌","빙상장":"⛸️","승마장":"🐎","골프연습장":"⛳","국궁장":"🏹","기타 체육시설":"🏟️"};
  function render(){
    const stats=(window.FACILITY_TYPE_STATS||[]).filter(x=>x.count>0).sort((a,b)=>b.count-a.count).slice(0,8);
    document.querySelector("#homeCategories").innerHTML=stats.map(x=>`<a class="category-card card" href="./facilities.html?type=${encodeURIComponent(x.type)}"><div class="category-icon">${icons[x.type]||"🏟️"}</div><h3>${SportsFinder.escapeHtml(x.type)}</h3><p>2021 public facility data</p><strong>${x.count.toLocaleString()}곳</strong></a>`).join("");
    document.querySelector("#homeActivities").innerHTML=(window.ACTIVITY_CATALOG||[]).slice(0,6).map(a=>`<a class="activity-card card activity-link" href="./programs.html?activity=${encodeURIComponent(a.sport)}"><div class="activity-photo activity-photo--${activityClass(a.sport)}"><span>${a.icon}</span></div><div class="activity-card-content"><h3>${SportsFinder.escapeHtml(a.sport)}</h3><p>${a.facilityTypes.map(SportsFinder.escapeHtml).join(" · ")}</p><ul>${a.examples.map(e=>`<li class="tag">${SportsFinder.escapeHtml(e)}</li>`).join("")}</ul><strong class="activity-more">프로그램 보기 →</strong></div></a>`).join("");
  }
  document.querySelector("#homeSearch").addEventListener("submit",e=>{e.preventDefault();const q=document.querySelector("#homeKeyword").value.trim();if(!q){SportsFinder.toast(SportsFinder.t("tryAgain"),"error");return;}location.href=`./facilities.html?q=${encodeURIComponent(q)}`});
  document.addEventListener("sportsfinder:languageChanged",render);render();
});
