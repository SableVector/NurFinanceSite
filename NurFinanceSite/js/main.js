"use strict";

window.addEventListener("DOMContentLoaded", function () {
  var e = document.querySelector(".header__bottom-search-btn"),
      t = document.querySelector(".header__bottom-search-input");
  e.addEventListener("click", function (e) {
    t.classList.toggle("header__bottom-search-input--active");
  });
});