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

  // handle user registration
  $(".register-form").submit(e => {
    e.preventDefault();
    const firstname = $("#registerFirstName").val();
    const lastname = $("#registerLastName").val();
    const username = $("#registerUserName").val();
    const email = $("#registerEmail").val();
    const password = $("#registerPassword").val();
    const confPassword = $("#confirmPassword").val();

    if (firstname == "") alert("Please enter your first name");
    else if (lastname == "") alert("Please enter your last name");
    else if (username == "") alert("Please enter your user name");
    else if (email == "") alert("Please enter your email");
    else if (password == "") alert("Please enter your password");
    else if (confPassword != password) alert("Password do not match");
    else {
      const newUserObj = {
        firstname: firstname,
        lastname: lastname,
        username: username,
        email: email,
        password: password
      };
      $.ajax({
        type: "POST",
        url: "/users/register",
        dataType: "json",
        data: JSON.stringify(newUserObj),
        contentType: "application/json"
      })
        .done(result => {
          $(".register-page").hide();
          $(".headbar").hide();
          $(".main-page").show();
        })
        .fail(error => console.log(error));
    }
  });

  // handle user login
  $(".login-form").submit(e => {
    e.preventDefault();
    const username = $("#loginUserName").val();
    const password = $("#loginPassword").val();
    console.log(password);
    if (username == "") alert("Please enter your username");
    else if (password == "") alert("Please enter your password");
    else {
      const loginUserObj = { username: username, password: password };
      $.ajax({
        type: "POST",
        url: "/users/login",
        dataType: "json",
        data: JSON.stringify(loginUserObj),
        contentType: "application/json"
      })
        .done(result => {
          $(".login-page").hide();
          $(".headbar").hide();
          $(".main-page").show();
        })
        .fail(error => {
          console.log(error);
          alert("Incorrect username or password");
        });
    }
  });
});
