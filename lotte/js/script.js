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
document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // Top Button
    // =========================

    const topButton =
        document.querySelector(".top-button");


    // Top 버튼이 있을 때만 실행
    if (topButton) {

        // 스크롤 위치에 따라 버튼 표시 및 숨김
        function toggleTopButton() {

            if (window.scrollY >= 300) {

                // 300px 이상 스크롤하면 버튼 표시
                topButton.classList.add("show");

            } else {

                // 페이지 상단에서는 버튼 숨김
                topButton.classList.remove("show");

            }

        }


        // 스크롤 이벤트
        window.addEventListener(
            "scroll",
            toggleTopButton
        );


        // Top 버튼 클릭
        topButton.addEventListener("click", function () {

            // 페이지 맨 위로 부드럽게 이동
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });


        // 페이지를 새로고침했을 때 현재 위치 확인
        toggleTopButton();

    }

});
// =========================
// Main Event Popup
// =========================

window.addEventListener("load", function () {

    const mainEventPopup =
        document.querySelector(".main-event-popup");

    const mainEventClose =
        document.querySelector(".main-event-close");

    const mainEventOverlay =
        document.querySelector(".main-event-overlay");


    // 팝업 요소가 없으면 실행 중지
    if (!mainEventPopup) {
        return;
    }


    // =========================
    // 페이지 로딩 후 팝업 열기
    // =========================

    mainEventPopup.classList.add("open");

    mainEventPopup.setAttribute(
        "aria-hidden",
        "false"
    );

    // 팝업이 열렸을 때 배경 스크롤 방지
    document.body.style.overflow = "hidden";


    // =========================
    // 팝업 닫기 함수
    // =========================

    function closeMainEventPopup() {

        mainEventPopup.classList.remove("open");

        mainEventPopup.setAttribute(
            "aria-hidden",
            "true"
        );

        // 배경 스크롤 다시 허용
        document.body.style.overflow = "";

    }


    // 닫기 버튼 클릭
    if (mainEventClose) {

        mainEventClose.addEventListener(
            "click",
            closeMainEventPopup
        );

    }


    // 검은 배경 클릭
    if (mainEventOverlay) {

        mainEventOverlay.addEventListener(
            "click",
            closeMainEventPopup
        );

    }


    // ESC 키로 팝업 닫기
    document.addEventListener("keydown", function (event) {

        if (
            event.key === "Escape" &&
            mainEventPopup.classList.contains("open")
        ) {
            closeMainEventPopup();
        }

    });

});
/* =========================
   Hot Menu 탭 기능
   새로고침할 때마다 시작 탭 순차 변경
========================= */
document.addEventListener("DOMContentLoaded", function () {

    /* Hot Menu 탭과 패널 찾기 */
    const hotMenuTabs = document.querySelectorAll("[data-hot-tab]");
    const hotMenuPanels =
        document.querySelectorAll("[data-hot-panel]");

    /* Hot Menu가 없으면 실행하지 않음 */
    if (!hotMenuTabs.length || !hotMenuPanels.length) {
        return;
    }


    /* =========================
       탭 순서
    ========================= */
    const hotMenuOrder = [
        "lotteria",
        "pleating",
        "angelinus",
        "krispy"
    ];


    /* =========================
       선택된 탭으로 변경하는 함수
    ========================= */
    function changeHotMenuTab(selectedName, moveFocus = false) {

        /* 탭 버튼 선택 상태 변경 */
        hotMenuTabs.forEach(function (tab) {
            const isSelected =
                tab.dataset.hotTab === selectedName;

            tab.classList.toggle("active", isSelected);
            tab.setAttribute(
                "aria-selected",
                String(isSelected)
            );

            tab.setAttribute(
                "tabindex",
                isSelected ? "0" : "-1"
            );

            /* 방향키 이동일 때만 포커스 적용 */
            if (isSelected && moveFocus) {
                tab.focus();
            }
        });


        /* 선택한 패널만 화면에 표시 */
        hotMenuPanels.forEach(function (panel) {
            const isSelected =
                panel.dataset.hotPanel === selectedName;

            panel.classList.toggle("active", isSelected);
            panel.hidden = !isSelected;
        });
    }


    /* =========================
       새로고침 시작 탭 계산
    ========================= */

    /*
        sessionStorage를 사용하므로
        현재 브라우저 탭이 열려 있는 동안
        새로고침할 때마다 숫자가 저장됩니다.
    */
    let currentIndex = Number(
        sessionStorage.getItem("hotMenuStartIndex")
    );

    /* 저장된 값이 없거나 잘못된 경우 0번부터 시작 */
    if (
        !Number.isInteger(currentIndex) ||
        currentIndex < 0 ||
        currentIndex >= hotMenuOrder.length
    ) {
        currentIndex = 0;
    }

    /* 이번 화면에서 보여줄 브랜드 */
    const firstBrand = hotMenuOrder[currentIndex];

    /* 해당 브랜드를 첫 화면에 표시 */
    changeHotMenuTab(firstBrand);

    /* 다음 새로고침에 표시할 탭 번호 저장 */
    const nextIndex =
        (currentIndex + 1) % hotMenuOrder.length;

    sessionStorage.setItem(
        "hotMenuStartIndex",
        String(nextIndex)
    );


    /* =========================
       탭 클릭 기능
    ========================= */
    hotMenuTabs.forEach(function (tab, index) {

        /* 탭 클릭 */
        tab.addEventListener("click", function () {
            changeHotMenuTab(tab.dataset.hotTab);
        });


        /* =========================
           키보드 방향키 기능
        ========================= */
        tab.addEventListener("keydown", function (event) {
            let nextTabIndex = index;

            /* 오른쪽 방향키 */
            if (event.key === "ArrowRight") {
                nextTabIndex =
                    (index + 1) % hotMenuTabs.length;
            }

            /* 왼쪽 방향키 */
            else if (event.key === "ArrowLeft") {
                nextTabIndex =
                    (
                        index - 1 + hotMenuTabs.length
                    ) % hotMenuTabs.length;
            }

            /* 처음 탭 */
            else if (event.key === "Home") {
                nextTabIndex = 0;
            }

            /* 마지막 탭 */
            else if (event.key === "End") {
                nextTabIndex = hotMenuTabs.length - 1;
            }

            /* 관련 없는 키는 실행 중단 */
            else {
                return;
            }

            event.preventDefault();

            const nextTab = hotMenuTabs[nextTabIndex];

            changeHotMenuTab(
                nextTab.dataset.hotTab,
                true
            );
        });
    });

});
/* =========================
   Header 메뉴 선택 상태 초기화
========================= */
document.addEventListener("DOMContentLoaded", function () {
    const headerNav = document.querySelector(".header-nav");

    if (!headerNav) {
        return;
    }

    /* 메뉴 영역에서 마우스가 벗어나면 선택 효과 제거 */
    headerNav.addEventListener("mouseleave", function () {
        document
            .querySelectorAll(".gnb > li.active")
            .forEach(function (item) {
                item.classList.remove("active");
            });

        document
            .querySelectorAll(".depth2 a.selected")
            .forEach(function (link) {
                link.classList.remove("selected");
            });
    });
});