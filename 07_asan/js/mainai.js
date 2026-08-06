"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const bannerElement = document.querySelector(".main-banner");

    if (!bannerElement) {
        console.error("'.main-banner' 요소를 찾을 수 없습니다.");
        return;
    }

    if (typeof Swiper === "undefined") {
        console.error(
            "Swiper 라이브러리가 연결되지 않았습니다. " +
            "HTML에서 swiper-bundle.min.js 연결 순서를 확인해주세요."
        );
        return;
    }

    const mainBannerSwiper = new Swiper(".main-banner", {
        // 가로 방향 슬라이드
        direction: "horizontal",

        // 마지막 배너 다음에 첫 번째 배너로 반복
        loop: true,

        // 한 화면에 보이는 슬라이드 개수
        slidesPerView: 1,

        // 슬라이드 사이 간격
        spaceBetween: 0,

        // 슬라이드 전환 속도
        speed: 600,

        // 자동 재생
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
        },

        // 손가락과 마우스로 밀어서 이동
        simulateTouch: true,
        allowTouchMove: true,

        // 페이지네이션
        pagination: {
            el: ".main-banner .swiper-pagination",
            clickable: true
        },

        // 이전·다음 버튼
        navigation: {
            nextEl: ".main-banner .swiper-button-next",
            prevEl: ".main-banner .swiper-button-prev"
        },

        // 키보드 방향키 이동
        keyboard: {
            enabled: true,
            onlyInViewport: true
        },

        // 접근성
        a11y: {
            enabled: true,
            prevSlideMessage: "이전 배너",
            nextSlideMessage: "다음 배너",
            firstSlideMessage: "첫 번째 배너입니다.",
            lastSlideMessage: "마지막 배너입니다.",
            paginationBulletMessage: "{{index}}번째 배너로 이동"
        },

        // Swiper 상태 변경 시 자동 갱신
        observer: true,
        observeParents: true,

        // 이미지가 로드된 후 크기 재계산
        on: {
            init: function () {
                this.update();
            },

            imagesReady: function () {
                this.update();
            },

            resize: function () {
                this.update();
            }
        }
    });

    // 탭이 다시 활성화되었을 때 자동재생 재시작
    document.addEventListener("visibilitychange", function () {
        if (document.hidden) {
            mainBannerSwiper.autoplay.stop();
        } else {
            mainBannerSwiper.autoplay.start();
        }
    });
});