(function () {
  "use strict";
  const config = window.WEDDING_CONFIG || {};
  const form = document.querySelector("#guestbook-form");
  if (!form) return;

  const status = document.querySelector("#form-status");
  const submitButton = document.querySelector("#guestbook-submit");
  const message = document.querySelector("#message");
  const counter = document.querySelector("#message-count");
  const list = document.querySelector("#guest-list");
  const isConfigured = () => config.googleAppsScriptUrl && !config.googleAppsScriptUrl.includes("여기에_");

  function setStatus(text, type) {
    status.textContent = text;
    status.className = `form-status show ${type}`;
  }

  function safeText(value) { return String(value ?? "").trim(); }

  function validate(data) {
    if (data.name.length < 2 || data.name.length > 20) return "이름은 2~20자로 입력해 주세요.";
    if (!data.side) return "관계를 선택해 주세요.";
    if (data.message.length < 1 || data.message.length > 200) return "메시지는 1~200자로 입력해 주세요.";
    if (/<\/?script|javascript:/i.test(`${data.name} ${data.message}`)) return "사용할 수 없는 문자가 포함되어 있습니다.";
    return "";
  }

  function createGuestItem(item) {
    const article = document.createElement("article");
    article.className = "guest-item reveal is-visible";
    const head = document.createElement("div"); head.className = "guest-head";
    const identity = document.createElement("div");
    const name = document.createElement("strong"); name.className = "guest-name"; name.textContent = safeText(item.name);
    const side = document.createElement("span"); side.className = "guest-side"; side.textContent = safeText(item.side);
    identity.append(name, side);
    const date = document.createElement("time"); date.className = "guest-date";
    date.textContent = item.createdAt ? new Date(item.createdAt).toLocaleDateString("ko-KR") : "방금 전";
    const body = document.createElement("p"); body.className = "guest-message"; body.textContent = safeText(item.message);
    head.append(identity, date); article.append(head, body); return article;
  }

  async function loadGuestbook() {
    if (!isConfigured()) {
      list.innerHTML = '<p class="empty-state">Google Apps Script URL을 설정하면 승인된 축하 메시지가 표시됩니다.</p>';
      return;
    }
    list.innerHTML = '<p class="empty-state">축하 메시지를 불러오는 중입니다.</p>';
    try {
      const response = await fetch(`${config.googleAppsScriptUrl}?action=list`, { method: "GET", redirect: "follow" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = await response.json();
      if (!result.success || !Array.isArray(result.items)) throw new Error("invalid response");
      list.replaceChildren();
      if (!result.items.length) list.innerHTML = '<p class="empty-state">첫 번째 축하 메시지를 남겨주세요.</p>';
      else result.items.forEach((item) => list.appendChild(createGuestItem(item)));
    } catch (error) {
      console.error("방명록 조회 오류:", error);
      list.innerHTML = '<p class="empty-state">메시지를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.</p>';
    }
  }

  message.addEventListener("input", () => { counter.textContent = String(message.value.length); });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = {
      name: safeText(form.name.value), side: safeText(form.side.value),
      message: safeText(form.message.value), website: safeText(form.website.value)
    };
    const error = validate(data);
    if (error) { setStatus(error, "error"); return; }
    if (!isConfigured()) { setStatus("js/config.js에 Google Apps Script URL을 입력해 주세요.", "error"); return; }
    submitButton.disabled = true; submitButton.textContent = "마음을 전하는 중...";
    try {
      const response = await fetch(config.googleAppsScriptUrl, {
        method: "POST", redirect: "follow",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = await response.json();
      if (!result.success) throw new Error(result.message || "save failed");
      form.reset(); counter.textContent = "0";
      setStatus("따뜻한 마음이 잘 전달되었습니다. 승인 후 방명록에 표시됩니다.", "success");
    } catch (fetchError) {
      console.error("방명록 저장 오류:", fetchError);
      setStatus("전송하지 못했어요. 입력 내용은 그대로 두었으니 다시 시도해 주세요.", "error");
    } finally {
      submitButton.disabled = false; submitButton.textContent = "축하 메시지 남기기";
    }
  });

  document.addEventListener("DOMContentLoaded", loadGuestbook);
})();
