const more = document.querySelector(".moreInfo__ders1");
const showbtn = document.querySelector(".moreInfo__btn1");
showbtn.onclick = function () {
  more.classList.toggle("active");
  if (more.classList.contains("active")) {
    showbtn.innerText = "Thu gọn";
  } else {
    showbtn.innerText = "Mở rộng";
  }
};

const swiper = new Swiper(".swiper", {
  // Optional parameters
  direction: "horizontal",
  loop: true,
  autoplay: true,

  // If we need pagination
  pagination: {
    el: ".swiper-pagination",
  },

  // Navigation arrows
  // navigation: {
  //   nextEl: ".swiper-button-next",
  //   prevEl: ".swiper-button-prev",
  // },

  // And if we need scrollbar
  // scrollbar: {
  //   el: ".swiper-scrollbar",
  // },
});
