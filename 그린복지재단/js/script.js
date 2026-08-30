$(function(){
    $(".gnb>li").mouseenter(function(){
       $(".depth2, .box").stop().fadeIn();
    });
    $(".gnb").mouseleave(function(){
       $(".depth2, .box").stop().fadeOut();
    });
    
    // slide구현하기
    setInterval(function(){

    $(".slide ul").animate(
        { left: "-=1200px" },
        "slow",
        function(){

            $(".slide ul li").first().appendTo(".slide ul");
            $(".slide ul").css("left", 0);

        }
    );

}, 3000);
      $(".btn2").click(function(){
        $(".list").slideToggle();
      });
    // popup버튼
    $(".first").click(function(){
        $(".popup").show();
    });
      $(".btn1").click(function(){
        $(".popup").hide();
    });
      

});