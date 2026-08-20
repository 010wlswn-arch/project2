// =========================
// MAIN SWIPER
// =========================

const mainSwiper = new Swiper(".mainSwiper", {

    // 가로 방향
    direction: "horizontal",

    // 화면에 1장씩
    slidesPerView: 1,

    // 한 장씩 이동
    slidesPerGroup: 1,

    // 무한 반복
    loop: true,

    // 이동 속도
    speed: 700,

    // 3초마다 자동 실행
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },

    // 좌우 버튼
    navigation: {
        nextEl: ".mainSwiper .swiper-button-next",
        prevEl: ".mainSwiper .swiper-button-prev",
    },

    // 페이지 번호
    pagination: {
        el: ".mainSwiper .swiper-pagination",
        type: "fraction",
    },

});
// =========================
// 주메뉴 + 2차메뉴 언더라인 연결
// =========================

// 주메뉴 6개
const gnbItems = document.querySelectorAll(".gnb > li");

// 2차메뉴 6개
const depth2Menus = document.querySelectorAll(".depth2-menu");


// =========================
// 2차메뉴에 마우스를 올렸을 때
// 해당 주메뉴에 active 추가
// =========================

depth2Menus.forEach(function (menu, index) {

    menu.addEventListener("mouseenter", function () {

        // 모든 주메뉴의 active 제거
        gnbItems.forEach(function (item) {
            item.classList.remove("active");
        });

        // 현재 2차메뉴와 같은 순서의
        // 주메뉴에 active 추가
        gnbItems[index].classList.add("active");

    });

});


// =========================
// 2차메뉴에서 마우스가 빠졌을 때
// active 제거
// =========================

depth2Menus.forEach(function (menu) {

    menu.addEventListener("mouseleave", function () {

        gnbItems.forEach(function (item) {
            item.classList.remove("active");
        });

    });

});