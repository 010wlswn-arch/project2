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
$(function () {

    // =========================
    // BRAND TAB 기능
    // =========================

    $(".tab li a").on("click", function (e) {

        // a 태그의 기본 이동 방지
        e.preventDefault();


        // 클릭한 버튼의 data-tab 값 가져오기
        const tabName = $(this).data("tab");


        // =========================
        // TAB 버튼 상태 변경
        // =========================

        // 기존 on 제거
        $(".tab li").removeClass("on");

        // 클릭한 li에 on 추가
        $(this).parent("li").addClass("on");


        // =========================
        // TAB 콘텐츠 변경
        // =========================

        // 모든 콘텐츠 숨김
        $(".tab-content").removeClass("on");

        // 선택한 콘텐츠만 표시
        $("#" + tabName).addClass("on");

    });

});
// jQuery
$(function () {

    // Family Site 버튼을 클릭하면
    $(".family-btn").click(function () {

        // Family Site 목록을 열기 / 닫기
        $(".family-list").slideToggle();

    });

});