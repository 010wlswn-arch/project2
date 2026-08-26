$(function(){

    // 마우스 hover시 부드럽게보임
    $(".gnb>li").mouseenter(function(){
        $(".depth2").fadeIn()
    })
    // 마우스 영역을 벗어났을때 부드럽게 사라짐
    $(".gnb").mouseleave(function(){
         $(".depth2").fadeOut()
    })
// 첫번째 공지사항을 클릭하면 팝업창을 보여라
$(".first").click(function(){
    $(".popup").show()
})


    // 닫기 버튼 클릭하면 팝업창 숨기기
    $("button").click(function(){
        $(".popup").hide()
    })

// 좌우 슬라이드
setInterval(function(){

    $(".slide ul").animate({
        left: "-=1200"
    }, "slow", function(){

        // 첫 번째 이미지를 맨 뒤로 이동
        $(".slide ul li").first().appendTo(".slide ul");

        // ul 위치를 원래 자리로 초기화
        $(".slide ul").css("left", 0);

    });

}, 3000);

     // 탭기능 설정

    //tab li 클릭하면 
    $(".tab li").click(function(){
        let num = $(this).index()
       console.log(num)
    //기존의 on class 모두 제거
    $(".tab li").removeClass("on")
    $(this).addClass("on")
    // 기존에 보이는 탭은 모두 숨김
    $(".wrap").hide()
    // 선택된번째 같은 번째를 보임
    $(".wrap").eq(num).show()

})
})