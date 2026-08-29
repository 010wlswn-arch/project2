$(function(){

    $(".gnb").mouseenter(function(){
        $(".depth2").css("display","grid");
    });

    $(".gnb").mouseleave(function(){
        $(".depth2").hide();
    });

    $(function(){

    let slideNum = 0;

    setInterval(function(){

        if(slideNum < 2){
            slideNum++;
        }else{
            slideNum = 0;
        }

        $(".slide li").fadeOut();
        $(".slide li").eq(slideNum).fadeIn();

    },3000);

});
$(".tab li").click(function(){

    $(".tab li").removeClass("on");
    $(this).addClass("on");

});
// 첫 번째 공지사항 클릭 시 팝업 열기
    $(".notice .first").click(function (e) {
        e.preventDefault();
        $(".popup").show();
    });


    // 닫기 버튼 클릭 시 팝업 숨기기
    $(".popup button").click(function () {
        $(".popup").hide();
    });


    // 공지사항·갤러리 탭
    $(".tab li").click(function (e) {
        e.preventDefault();

        let tabNum = $(this).index();

        // 탭 활성화 변경
        $(".tab li").removeClass("on");
        $(this).addClass("on");

        // 모든 내용 숨기기
        $(".notice, .gallery").hide();

        if (tabNum === 0) {
            $(".notice").show();
        } else {
            $(".gallery").css("display", "flex");
        }
    });

});