/* ========================================
   설화수 추천 Swiper
======================================== */


/*
    전체 슬라이드 개수

    총 6개의 상품이 있으므로 6
*/
const TOTAL_SLIDES = 6;


/* ========================================
   DOM 요소
======================================== */

const progressFill =
    document.querySelector(".progress-fill");

const playControl =
    document.querySelector(".play-control");


/* ========================================
   Swiper 생성
======================================== */

const recommendSwiper = new Swiper(
    ".recommend-swiper",
    {

        /*
            한 화면에 보여줄 슬라이드 개수
        */
        slidesPerView: 3,


        /*
            카드 사이 간격

            1440px 안에서 시안과 비슷하게
            3개의 카드가 배치되도록 설정
        */
        spaceBetween: 24,


        /*
            버튼 클릭 또는 자동재생 시
            한 개씩 이동
        */
        slidesPerGroup: 1,


        /*
            무한 반복
        */
        loop: true,


        /*
            슬라이드 이동 속도
        */
        speed: 700,


        /*
            자동재생
            3초마다 이동
        */
        autoplay: {

            delay: 3000,

            /*
                사용자가 버튼을 클릭해도
                자동재생이 계속 유지됨
            */
            disableOnInteraction: false
        },


        /*
            좌우 버튼
        */
        navigation: {

            nextEl: ".slide-next",

            prevEl: ".slide-prev"

        },


        /*
            슬라이드 이동이 끝날 때
            진행바 업데이트
        */
        on: {

            init: function () {

                updateProgress(this);

            },

            slideChange: function () {

                updateProgress(this);

            }

        }

    }
);


/* ========================================
   진행바 업데이트
======================================== */

function updateProgress(swiper) {

    /*
        loop 사용 시 activeIndex가 아니라
        realIndex를 사용해야
        실제 0~5 값이 들어옴
    */
    const currentIndex =
        swiper.realIndex + 1;


    /*
        현재 슬라이드 위치를
        전체 6개 기준 %로 계산
    */
    const progress =
        (currentIndex / TOTAL_SLIDES) * 100;


    /*
        막대 넓이 적용
    */
    progressFill.style.width =
        progress + "%";
}


/* ========================================
   일시정지 / 재생 버튼
======================================== */

playControl.addEventListener(
    "click",
    function () {

        /*
            현재 일시정지 상태인지 확인
        */
        const isPaused =
            playControl.classList.contains(
                "is-paused"
            );


        /*
            이미 멈춘 상태라면
            다시 자동재생
        */
        if (isPaused) {

            recommendSwiper.autoplay.start();

            playControl.classList.remove(
                "is-paused"
            );

            playControl.setAttribute(
                "aria-label",
                "슬라이드 일시정지"
            );

        }


        /*
            재생 중이라면
            자동재생 중지
        */
        else {

            recommendSwiper.autoplay.stop();

            playControl.classList.add(
                "is-paused"
            );

            playControl.setAttribute(
                "aria-label",
                "슬라이드 재생"
            );

        }

    }
);