$(function(){
    $(".gnb>li").mouseenter(function(){
        $(".depth2, .box").stop().fadeIn();
    });
        $(".gnb").mouseleave(function(){
        $(".depth2, .box").stop().fadeOut();
    });

    setInterval(function(){
        $(".slide ul").animate(
            {left : "-=1200px"}, "slow",
        function(){
            $(".slide ul li").first().appendTo(".slide ul");
            $(".slide ul").css("left" , 0);
        });

    }, 3000);


});

