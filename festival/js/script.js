$(function () {
    $(".gnb>li").mouseenter(function () {
        $(this).find(".depth2") .fadeIn()
    })
    $(".gnb>li").mouseleave(function () {
        $(this).find(".depth2").fadeOut()
    })
})
// fadeIn fadeOut slide
 let num = 0
setInterval(function(){
   if(num<2){
    num++
   }else{
    num=0
   }
//    점점 사라지게
   $(".slide li").fadeOut()
//    점점 보이게
   $(".slide li").eq(num).fadeIn()
},3000)

$(function)
    
