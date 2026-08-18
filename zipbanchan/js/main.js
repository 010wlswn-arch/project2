/* =========================
   모바일 햄버거 메뉴
========================= */

const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
const mobileMenu = document.querySelector(".mobile-menu");

mobileMenuBtn.addEventListener("click", function () {

    mobileMenuBtn.classList.toggle("active");
    mobileMenu.classList.toggle("active");

});


/* =========================
   모바일 내정보 아코디언
========================= */

const mobileMyBtn = document.querySelector(".mobile-my-btn");
const mobileMyMenu = document.querySelector(".mobile-my-menu");

mobileMyBtn.addEventListener("click", function () {

    mobileMyMenu.classList.toggle("active");

});