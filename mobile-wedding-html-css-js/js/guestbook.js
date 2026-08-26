document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("guestbook-form");
    const messageBox = document.getElementById("messages");
    let messages = JSON.parse(localStorage.getItem("wedding-guestbook") || "[]");

    function render() {
        messageBox.innerHTML = messages.map(item => `<article><strong>${escapeHTML(item.name)}</strong><p>${escapeHTML(item.message)}</p></article>`).join("");
    }
    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        const data = new FormData(form);
        const payload = { name: data.get("name").trim(), side: data.get("side"), message: data.get("message").trim() };
        try {
            if (WEDDING_CONFIG.GUESTBOOK_ENDPOINT) {
                await fetch(WEDDING_CONFIG.GUESTBOOK_ENDPOINT, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) });
            }
            messages.unshift(payload);
            messages = messages.slice(0, 6);
            localStorage.setItem("wedding-guestbook", JSON.stringify(messages));
            form.reset();
            render();
            showToast("축하 메시지가 저장되었습니다");
        } catch (error) {
            showToast("메시지를 저장하지 못했습니다");
        }
    });
    function escapeHTML(value) { const div = document.createElement("div"); div.textContent = value; return div.innerHTML; }
    render();
});
