 // =========================
    // Header Tab Menu
    // =========================

    const header = document.querySelector(".header");
    const gnbItems = document.querySelectorAll(".gnb > li");
    const gnbButtons = document.querySelectorAll(".gnb-button");
    const depth2Links = document.querySelectorAll(".depth2 a");


    // 상위 메뉴 클릭 이벤트
    gnbButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const currentItem = this.parentElement;
            const isCurrentActive = currentItem.classList.contains("active");
            const isMenuOpen = header.classList.contains("menu-open");

            // 현재 메뉴가 이미 선택된 상태에서 다시 클릭하면 닫기
            if (isCurrentActive && isMenuOpen) {
                header.classList.remove("menu-open");
                currentItem.classList.remove("active");
                return;
            }

            // 기존 상위 메뉴 선택 해제
            gnbItems.forEach(function (item) {
                item.classList.remove("active");
            });

            // 클릭한 상위 메뉴 선택
            currentItem.classList.add("active");

            // 전체 2단 메뉴 펼치기
            header.classList.add("menu-open");
        });
    });


    // 하위 메뉴 클릭 이벤트
    depth2Links.forEach(function (link) {
        link.addEventListener("click", function (event) {
            event.preventDefault();

            // 기존 하위 메뉴 선택 색상 제거
            depth2Links.forEach(function (depthLink) {
                depthLink.classList.remove("selected");
            });

            // 기존 상위 메뉴 선택 색상 제거
            gnbItems.forEach(function (item) {
                item.classList.remove("active");
            });

            // 클릭한 하위 메뉴 색상 적용
            this.classList.add("selected");

            // 클릭한 하위 메뉴가 속한 상위 메뉴 색상 적용
            const parentMenu = this.closest(".gnb > li");
            parentMenu.classList.add("active");
        });
    });


    // 헤더 바깥을 클릭하면 2단 메뉴 닫기
    document.addEventListener("click", function (event) {
        if (!header.contains(event.target)) {
            header.classList.remove("menu-open");
        }
    });
    document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // Swiper Slide
    // =========================

    const currentNumber = document.querySelector(".eatz-current");
    const totalNumber = document.querySelector(".eatz-total");
    const progressFill = document.querySelector(".eatz-progress-fill");
    const autoplayButton = document.querySelector(".eatz-autoplay-button");

    const totalSlides = 3;

    // 전체 슬라이드 수 표시
    totalNumber.textContent = totalSlides;


    // Swiper 실행
    const eatzSwiper = new Swiper(".eatz-swiper", {

        // 한 화면에 한 장 표시
        slidesPerView: 1,

        // 한 번 클릭할 때 한 장씩 이동
        slidesPerGroup: 1,

        // 3번 다음 다시 1번으로 무한 반복
        loop: true,

        // 슬라이드는 오른쪽에서 왼쪽 방향으로 이동
        direction: "horizontal",

        // 슬라이드 전환 속도
        speed: 700,

        // 마우스 드래그 허용
        simulateTouch: true,

        // 3초 자동재생
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
            reverseDirection: false
        },

        // 이전 및 다음 버튼
        navigation: {
            prevEl: ".eatz-prev",
            nextEl: ".eatz-next"
        },

        // 슬라이드가 변경됐을 때
        on: {
            init: function () {
                updateSlideInformation(this.realIndex);
            },

            slideChange: function () {
                updateSlideInformation(this.realIndex);
            }
        }

    });


    // =========================
    // 현재 페이지 및 막대 변경
    // =========================

    function updateSlideInformation(realIndex) {

        // Swiper의 realIndex는 0부터 시작
        const currentSlide = realIndex + 1;

        // 현재 페이지 표시
        currentNumber.textContent = currentSlide;

        // 진행 막대 너비
        progressFill.style.width =
            (currentSlide / totalSlides) * 100 + "%";
    }


    // =========================
    // 일시정지 및 재생
    // =========================

    autoplayButton.addEventListener("click", function () {

        // paused 클래스가 있는지 확인
        const isPaused =
            autoplayButton.classList.contains("paused");


        // 정지 상태라면 다시 재생
        if (isPaused) {

            eatzSwiper.autoplay.start();

            autoplayButton.classList.remove("paused");

            autoplayButton.setAttribute(
                "aria-label",
                "자동재생 일시정지"
            );

        } else {

            // 재생 중이라면 일시정지
            eatzSwiper.autoplay.stop();

            autoplayButton.classList.add("paused");

            autoplayButton.setAttribute(
                "aria-label",
                "자동재생 시작"
            );

        }

    });

});
document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // Menu Coupon Swiper
    // =========================

    const couponSwiperElement =
        document.querySelector(".coupon-swiper");


    // 쿠폰 슬라이더가 있을 때만 실행
    if (couponSwiperElement) {

        const couponSwiper = new Swiper(".coupon-swiper", {

            // 한 화면에 카드 4장 표시
            slidesPerView: 4,

            // 카드 사이 간격
            spaceBetween: 13,

            // 한 번에 카드 한 장씩 이동
            slidesPerGroup: 1,

            // 첫 화면에서는 이전 버튼을 숨기기 위해 loop 사용 안 함
            loop: false,

            // 마지막 다음 다시 첫 번째로 돌아가기
            rewind: true,

            // 슬라이드 이동 속도
            speed: 600,

            // 마우스 및 터치 드래그
            simulateTouch: true,
            allowTouchMove: true,

            // 3초마다 한 장씩 자동 이동
            autoplay: {
                delay: 3000,

                // 버튼을 눌러도 자동재생 유지
                disableOnInteraction: false,

                // 마우스를 올렸을 때도 자동재생 유지
                pauseOnMouseEnter: false,

                // 한쪽 방향으로 이동
                reverseDirection: false
            },

            // 이전 및 다음 버튼
            navigation: {
                prevEl: ".coupon-prev",
                nextEl: ".coupon-next"
            }

        });

    }

});
document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // Hot Menu 브랜드 탭
    // =========================

    const hotTabButtons =
        document.querySelectorAll(".hot-tab-button");


    hotTabButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            // 기존 선택된 탭 해제
            hotTabButtons.forEach(function (tabButton) {

                tabButton.classList.remove("active");

                tabButton.setAttribute(
                    "aria-selected",
                    "false"
                );

            });


            // 클릭한 탭 선택
            this.classList.add("active");

            this.setAttribute(
                "aria-selected",
                "true"
            );

        });

    });

});
document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // Family Site Popup
    // =========================

    const familyOpenButton =
        document.querySelector(".family-site-button");

    const familyModal =
        document.querySelector("#familySiteModal");

    const familyCloseButton =
        document.querySelector(".family-modal-close");

    const familyOverlay =
        document.querySelector(".family-modal-overlay");

    const familyGroupButtons =
        document.querySelectorAll(".family-group-button");


    // 패밀리 사이트 팝업 열기
    function openFamilyModal() {

        if (!familyModal || !familyOpenButton) {
            return;
        }

        familyModal.classList.add("open");

        familyModal.setAttribute(
            "aria-hidden",
            "false"
        );

        familyOpenButton.setAttribute(
            "aria-expanded",
            "true"
        );

        // 팝업이 열려 있을 때 배경 스크롤 방지
        document.body.style.overflow = "hidden";

        // 닫기 버튼으로 키보드 초점 이동
        if (familyCloseButton) {
            familyCloseButton.focus();
        }

    }


    // 패밀리 사이트 팝업 닫기
    function closeFamilyModal() {

        if (!familyModal || !familyOpenButton) {
            return;
        }

        familyModal.classList.remove("open");

        familyModal.setAttribute(
            "aria-hidden",
            "true"
        );

        familyOpenButton.setAttribute(
            "aria-expanded",
            "false"
        );

        // 배경 스크롤 복구
        document.body.style.overflow = "";

        // 패밀리 사이트 버튼으로 초점 복귀
        familyOpenButton.focus();

    }


    // 패밀리 사이트 버튼 클릭
    if (familyOpenButton) {

        familyOpenButton.addEventListener(
            "click",
            openFamilyModal
        );

    }


    // 닫기 버튼 클릭
    if (familyCloseButton) {

        familyCloseButton.addEventListener(
            "click",
            closeFamilyModal
        );

    }


    // 검은 배경 클릭
    if (familyOverlay) {

        familyOverlay.addEventListener(
            "click",
            closeFamilyModal
        );

    }


    // ESC 키로 팝업 닫기
    document.addEventListener("keydown", function (event) {

        if (
            event.key === "Escape" &&
            familyModal &&
            familyModal.classList.contains("open")
        ) {
            closeFamilyModal();
        }

    });


    // =========================
    // 패밀리 사이트 아코디언
    // =========================

    familyGroupButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const currentGroup =
                this.closest(".family-group");

            if (!currentGroup) {
                return;
            }

            const isOpen =
                currentGroup.classList.contains("active");


            // 현재 그룹 열기 및 닫기
            currentGroup.classList.toggle("active");

            this.setAttribute(
                "aria-expanded",
                String(!isOpen)
            );

        });

    });

});
document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // Footer 네모 버튼 선택
    // =========================

    const footerButtonGroups =
        document.querySelectorAll(
            ".site-footer .footer-button-list"
        );


    // 각 버튼 그룹별로 실행
    footerButtonGroups.forEach(function (buttonGroup) {

        const footerButtons =
            buttonGroup.querySelectorAll("a");


        footerButtons.forEach(function (button) {

            button.addEventListener("click", function (event) {

                // 현재 href="#"이므로 위로 이동하는 동작 방지
                event.preventDefault();


                // 같은 줄의 기존 선택 버튼 해제
                footerButtons.forEach(function (footerButton) {

                    footerButton.classList.remove("selected");

                    footerButton.setAttribute(
                        "aria-pressed",
                        "false"
                    );

                });


                // 클릭한 버튼 선택
                this.classList.add("selected");

                this.setAttribute(
                    "aria-pressed",
                    "true"
                );

            });

        });

    });

});