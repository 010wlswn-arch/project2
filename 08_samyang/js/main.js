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
/* =========================
   팝업 요소 불러오기
========================= */

const popupWrap = document.getElementById("popupWrap");
const popupCloseBtn = document.getElementById("popupCloseBtn");
const bottomCloseBtn = document.getElementById("bottomCloseBtn");
const todayClose = document.getElementById("todayClose");


/* =========================
   페이지 로딩 시 팝업 확인
========================= */

window.addEventListener("DOMContentLoaded", function () {

    /*
        localStorage에 저장된
        오늘 하루 닫기 날짜를 가져옴
    */
    const popupCloseDate =
        localStorage.getItem("popupCloseDate");

    /*
        현재 날짜를 YYYY-MM-DD 형식으로 생성
    */
    const today =
        new Date().toLocaleDateString("sv-SE");

    /*
        오늘 하루 닫기를 하지 않았거나
        저장된 날짜가 오늘과 다르면 팝업 표시
    */
    if (popupCloseDate !== today) {
        popupWrap.style.display = "flex";
    }

});


/* =========================
   팝업 닫기 함수
========================= */

function closePopup() {

    /*
        체크박스가 체크되어 있으면
        오늘 날짜를 localStorage에 저장
    */
    if (todayClose.checked) {

        const today =
            new Date().toLocaleDateString("sv-SE");

        localStorage.setItem(
            "popupCloseDate",
            today
        );
    }

    /* 팝업 닫기 */
    popupWrap.style.display = "none";

}


/* =========================
   X 버튼 클릭
========================= */

popupCloseBtn.addEventListener(
    "click",
    closePopup
);


/* =========================
   하단 닫기 버튼 클릭
========================= */

bottomCloseBtn.addEventListener(
    "click",
    closePopup
);
/* =========================
   TOP 버튼
========================= */

const topBtn = document.getElementById("topBtn");


/* =========================
   스크롤 시 버튼 표시
========================= */

window.addEventListener("scroll", function () {

    /*
        화면을 300px 이상 내렸을 때
        TOP 버튼 표시
    */
    if (window.scrollY > 300) {

        topBtn.classList.add("show");

    } else {

        topBtn.classList.remove("show");

    }

});


/* =========================
   TOP 버튼 클릭
========================= */

topBtn.addEventListener("click", function () {

    /*
        페이지 맨 위로
        부드럽게 스크롤
    */
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});