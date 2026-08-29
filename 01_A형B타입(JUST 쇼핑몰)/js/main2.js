$(function(){

    // 2단 메뉴
    $(".gnb > li").mouseenter(function(){
        $(".depth2").fadeIn();
    });

    $(".gnb").mouseleave(function(){
        $(".depth2").fadeOut();
    });
    


    // slide
    setInterval(function(){

        $(".slide ul").animate(
            { top: "-=300" },
            "slow",
            function(){

                $(".slide ul li").first().appendTo(".slide ul");
                $(".slide ul").css("top", 0);

            }
        );

    }, 3000);

   $(".tab li").click(function(){

    let num = $(this).index();

    $(".tab li").removeClass("on");
    $(this).addClass("on");

    if(num == 0){
        $(".wrap").show();
        $(".wrap2").hide();
    }else{
        $(".wrap").hide();
        $(".wrap2").show();
    }

});

});

