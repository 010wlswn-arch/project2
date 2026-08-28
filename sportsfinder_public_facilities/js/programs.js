
document.addEventListener("DOMContentLoaded",()=>{
  const programs=window.PUBLIC_PROGRAMS||[],catalog=window.ACTIVITY_CATALOG||[];
  const q=document.querySelector("#programQ"),province=document.querySelector("#programProvince"),facility=document.querySelector("#programFacility"),category=document.querySelector("#programCategory"),grid=document.querySelector("#programGrid"),count=document.querySelector("#programCount"),form=document.querySelector("#programFilter");
  function opts(values){return `<option value="">${SportsFinder.t("all")}</option>`+[...new Set(values.filter(Boolean))].sort().map(v=>`<option>${SportsFinder.escapeHtml(v)}</option>`).join("")}
  function fill(){province.innerHTML=opts(programs.map(x=>x.province));facility.innerHTML=opts(programs.map(x=>x.facility));category.innerHTML=opts(programs.map(x=>x.category))}
  function renderPrograms(){const keyword=q.value.trim().toLowerCase();const rows=programs.filter(x=>{const text=[x.facility,x.province,x.category,x.programName,x.days,x.target,x.description].join(" ").toLowerCase();return(!keyword||text.includes(keyword))&&(!province.value||x.province===province.value)&&(!facility.value||x.facility===facility.value)&&(!category.value||x.category===category.value)});count.textContent=rows.length;grid.innerHTML=rows.length?rows.map(x=>`<article class="program-card card"><span class="tag">${SportsFinder.escapeHtml(x.province)}</span><h3>${SportsFinder.escapeHtml(x.programName)}</h3><p class="section-copy">${SportsFinder.escapeHtml(x.facility)}</p><div class="program-meta"><div><span>${SportsFinder.t("days")}</span><strong>${SportsFinder.escapeHtml(x.days||"-")}</strong></div><div><span>${SportsFinder.t("time")}</span><strong>${SportsFinder.escapeHtml(x.time||"-")}</strong></div><div><span>${SportsFinder.t("target")}</span><strong>${SportsFinder.escapeHtml(x.target||"-")}</strong></div><div><span>${SportsFinder.t("fee")}</span><strong>${SportsFinder.escapeHtml(x.fee||"-")}</strong></div></div><p class="section-copy">${SportsFinder.escapeHtml(x.description||"")}</p><p class="section-copy">${SportsFinder.t("sourceDate")}: ${SportsFinder.escapeHtml(x.sourceDate)}</p></article>`).join(""):`<div class="empty"><strong>${SportsFinder.t("noResults")}</strong></div>`}
  function renderCatalog(){document.querySelector("#activityCatalog").innerHTML=catalog.map(a=>`<article class="activity-card card"><div class="icon">${a.icon}</div><h3>${SportsFinder.escapeHtml(a.sport)}</h3><p>${a.facilityTypes.map(SportsFinder.escapeHtml).join(" · ")}</p><ul>${a.examples.map(e=>`<li class="tag">${SportsFinder.escapeHtml(e)}</li>`).join("")}</ul></article>`).join("")}
  document.querySelectorAll(".tab-btn").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll(".tab-btn").forEach(b=>b.classList.toggle("is-active",b===btn));document.querySelector("#actualPanel").classList.toggle("hidden",btn.dataset.tab!=="actual");document.querySelector("#guidePanel").classList.toggle("hidden",btn.dataset.tab!=="guide")}));
  form.addEventListener("submit",e=>{e.preventDefault();renderPrograms();SportsFinder.toast(SportsFinder.t("filterSuccess"),"success")});[province,facility,category].forEach(el=>el.addEventListener("change",renderPrograms));
  fill();renderPrograms();renderCatalog();
  const activityParam=new URLSearchParams(location.search).get("activity");
  if(activityParam){
    const guideBtn=document.querySelector('[data-tab="guide"]');
    if(guideBtn) guideBtn.click();
    [...document.querySelectorAll("#activityCatalog .activity-card")].forEach(card=>{
      if(card.querySelector("h3")?.textContent.trim()===activityParam){card.classList.add("is-highlighted");card.scrollIntoView({behavior:"smooth",block:"center"});}
    });
  }
});
