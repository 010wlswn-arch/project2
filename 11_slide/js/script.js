/* ========================================
   슬라이드 번호
======================================== */

const currentSlide =
    document.querySelector(".current-slide");

const totalSlide =
    document.querySelector(".total-slide");


/* 전체 슬라이드 개수 */
const slideCount = 6;

totalSlide.textContent = slideCount;


/* ========================================
   Swiper 생성
======================================== */

const mainSwiper = new Swiper(".mainSwiper", {

    /* 한 화면에 1개 */
    slidesPerView: 1,

    /* 한 번에 1개 이동 */
    slidesPerGroup: 1,

    /* 무한 반복 */
    loop: true,

    /* 슬라이드 이동 속도 */
    speed: 700,

    /* 3초마다 자동재생 */
    autoplay: {
        delay: 3000,

        /* 버튼 클릭 후에도 자동재생 유지 */
        disableOnInteraction: false,

        /* 앞으로만 진행 */
        reverseDirection: false
    },

    /* 좌우 버튼 */
    navigation: {
        nextEl: ".main-next",
        prevEl: ".main-prev"
    },

    /* 슬라이드 이벤트 */
    on: {

        /* 처음 실행 */
        init: function () {
            currentSlide.textContent =
                this.realIndex + 1;
        },

        /* 슬라이드가 변경될 때 */
        slideChange: function () {
            currentSlide.textContent =
                this.realIndex + 1;
        }

    }

});


/* ========================================
   카테고리 더보기 / 접기
======================================== */

const categoryList =
    document.querySelector(".category-list");

const moreButton =
    document.querySelector(".category-more-btn");

const moreText =
    document.querySelector(".more-text");


moreButton.addEventListener("click", function () {

    /* 카테고리 펼치기 / 접기 */
    categoryList.classList.toggle("open");

    /* 버튼 상태 변경 */
    moreButton.classList.toggle("open");

    /* 현재 펼쳐진 상태 확인 */
    const isOpen =
        categoryList.classList.contains("open");

    /* 버튼 글자 변경 */
    if (isOpen) {
        moreText.textContent = "접기";
    } else {
        moreText.textContent = "더보기";
    }

});