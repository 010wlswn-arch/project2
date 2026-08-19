// =============================
// 버튼 선택
// =============================

let btn1 = document.querySelector("#btn1");
let btn2 = document.querySelector("#btn2");
let btn3 = document.querySelector("#btn3");
let btn4 = document.querySelector("#btn4");
let btn5 = document.querySelector("#btn5");
let btn6 = document.querySelector("#btn6");
let btn7 = document.querySelector("#btn7");
let btn8 = document.querySelector("#btn8");


// =============================
// 박스 선택
// =============================

let box1 = document.querySelector(".box1");
let box2 = document.querySelector(".box2");
let box3 = document.querySelector(".box3");
let box4 = document.querySelector(".box4");
let box5 = document.querySelector(".box5");


// =============================
// fadeIn
// =============================

btn1.addEventListener("click", function () {
    box1.style.opacity = "1";
});


// =============================
// fadeOut
// =============================

btn2.addEventListener("click", function () {
    box1.style.opacity = "0";
});


// =============================
// fadeToggle
// =============================

btn3.addEventListener("click", function () {

    if (box2.style.opacity === "0") {
        box2.style.opacity = "1";
    } else {
        box2.style.opacity = "0";
    }

});


// =============================
// slideUp
// =============================

btn4.addEventListener("click", function () {
    box3.style.height = "0px";
});


// =============================
// slideDown
// =============================

btn5.addEventListener("click", function () {
    box3.style.height = "200px";
});


// =============================
// slideToggle
// =============================

btn6.addEventListener("click", function () {

    if (box4.style.height === "0px") {
        box4.style.height = "200px";
    } else {
        box4.style.height = "0px";
    }

});

// =============================
// ani1
// 파란색 박스를 오른쪽으로 500px 이동
// =============================

btn7.addEventListener("click", function () {
    box5.style.transform = "translateX(500px)";
});


// =============================
// ani2
// 파란색 박스를 원래 위치로 이동
// =============================

btn8.addEventListener("click", function () {
    box5.style.transform = "translateX(0)";
});
