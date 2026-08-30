$(function () {
    $(".gnb > li").mouseenter(function(){
    $(this).children(".depth2").stop().show();
});

$(".gnb > li").mouseleave(function(){
    $(this).children(".depth2").stop().hide();
});
    setInterval(function () {
        $(".slide ul").animate({
            left: "-800px"
        }, 3000, function () {
            $(".slide ul li:first").appendTo(".slide ul");
            $(".slide ul").css("left", "0");
        });
    }, 3000);
    $(".btn2").click(function(){
    $(".list").slideToggle();
});
$(".first").click(function(){
    $(".popup").show()
});
$(".btn1").click(function(){
    $(".popup").hide()
});

});