$(function(){

    
    $(".gnb>li").mouseenter(function(){
        $(".depth2, .box").stop().fadeIn();
    });
    $(".gnb").mouseleave(function(){
        $(".depth2, .box").stop().fadeOut();
    });
    setInterval(function(){

        $(".slide ul").animate(
            {top: "-=300px"},
            "slow",
            function(){
                $(".slide ul li").first().appendTo(".slide ul");
                $(".slide ul").css("top", 0);
            }
        );

    }, 3000);
    // family 버튼을 클릭하면 한번 보이고/ 숨김
    $(".btn2").click(function(){
        $(".list").fadeToggle();
    })
    //  POPUP
    $(".first").click(function(){
        $(".popup").show();
    });
    $(".btn1").click(function(){
        $(".popup").hide();
    });


});