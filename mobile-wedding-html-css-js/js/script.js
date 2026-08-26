document.addEventListener("DOMContentLoaded", function () {
    /* 실시간 카운트다운 */
    const weddingTime = new Date("2026-09-01T12:00:00+09:00").getTime();
    function updateCountdown() {
        const distance = Math.max(0, weddingTime - Date.now());
        const values = {
            days: Math.floor(distance / 86400000),
            hours: Math.floor(distance / 3600000) % 24,
            minutes: Math.floor(distance / 60000) % 60,
            seconds: Math.floor(distance / 1000) % 60
        };
        Object.entries(values).forEach(([id, value]) => {
            document.getElementById(id).textContent = String(value).padStart(2, "0");
        });
    }
    updateCountdown();
    setInterval(updateCountdown, 1000);

    /* 3초 자동 좌우 슬라이드 */
    const track = document.querySelector(".gallery-track");
    const slides = [...track.querySelectorAll("img")];
    const dotsWrap = document.querySelector(".dots");
    const number = document.querySelector(".slide-number");
    let current = 0;
    slides.forEach((_, index) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.addEventListener("click", () => moveSlide(index));
        dotsWrap.appendChild(dot);
    });
    function moveSlide(index) {
        current = (index + slides.length) % slides.length;
        track.style.transform = `translateX(-${current * 100}%)`;
        [...dotsWrap.children].forEach((dot, i) => dot.classList.toggle("active", i === current));
        number.textContent = `${String(current + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
    }
    document.querySelector(".prev").addEventListener("click", () => moveSlide(current - 1));
    document.querySelector(".next").addEventListener("click", () => moveSlide(current + 1));
    moveSlide(0);
    setInterval(() => moveSlide(current + 1), 3000);

    /* 스크롤 등장 애니메이션 */
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    document.querySelectorAll(".reveal").forEach(element => observer.observe(element));

    /* 연락 버튼 */
    document.querySelectorAll("[data-call]").forEach(button => {
        button.addEventListener("click", () => {
            const phone = button.dataset.call === "groom" ? WEDDING_CONFIG.GROOM_PHONE : WEDDING_CONFIG.BRIDE_PHONE;
            phone ? location.href = `tel:${phone}` : showToast("config.js에 전화번호를 입력해 주세요");
        });
    });

    /* 계좌번호 복사 */
    document.querySelectorAll(".copy-account").forEach(button => {
        button.addEventListener("click", async () => {
            await navigator.clipboard.writeText(button.dataset.account);
            showToast("계좌번호가 복사되었습니다");
        });
    });
});

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2200);
}
