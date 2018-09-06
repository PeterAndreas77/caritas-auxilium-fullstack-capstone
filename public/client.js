"use strict";
$(document).ready(() => {
  // handle when user clicks register
  $("#register").on("click", () => {
    $(".landing-page").hide();
    $(".register-page").show();
    $(".login-page").hide();
  });
  //handle when user clicks login
  $("#login").on("click", () => {
    $(".landing-page").hide();
    $(".register-page").hide();
    $(".login-page").show();
  });
});
