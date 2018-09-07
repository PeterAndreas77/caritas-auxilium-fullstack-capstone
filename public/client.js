"use strict";

//MY ACCOUNT FUNCTIONS
function getMyAccount(myName) {
  $.ajax({
    type: "GET",
    url: `/user/${myName}`,
    dataType: "json",
    contentType: "application/json"
  })
    .done(result => renderMyAccount(result))
    .fail(err => console.log(err));
}
function renderMyAccount(userData) {
  $(".my-account").html(
    `<p>First Name: ${userData.firstname}</p>
    <p>Last Name: ${userData.lastname}</p>
    <p>User Name: ${userData.username}</p>
    <p>Email: ${userData.email}</p>`
  );
}

// RECENT CRISIS FUNCTIONS
function populateRecentCrisis() {
  $.ajax({
    type: "GET",
    url: `https://api.reliefweb.int/v1/reports?appname=caritas`,
    data: { preset: "latest" },
    dataType: "json"
  })
    .done(result => renderRecentCrisis(result))
    .fail(err => console.log(err));
}
function searchRecentCrisis(term) {
  $.ajax({
    type: "GET",
    url: `https://api.reliefweb.int/v1/reports?appname=caritas`,
    data: { query: { value: term }, preset: "latest" },
    dataType: "json"
  })
    .done(result => renderRecentCrisis(result))
    .fail(err => console.log(err));
}
function renderRecentCrisis(result) {
  const data = result.data;
  let recentCrisis = [];
  for (let i in data) {
    recentCrisis += `<div class="crisis-card" crisis-id="${data[i].id}">
    <p>${data[i].fields.title}</p>
    <a href="#" class="read-more">${data[i].href}</a>
    </div>`;
  }
  $(".crisis-container").html(recentCrisis);
}

// SINGLE CRISIS FUNCTIONS
function crisisReadMore(id) {
  $.ajax({
    type: "GET",
    url: `https://api.reliefweb.int/v1/reports/${id}`,
    dataType: "json"
  })
    .done(result => renderSingleCrisis(result))
    .fail(err => console.log(err));
}
function renderSingleCrisis(result) {
  const data = result.data[0].fields;
  let formatDate = moment(data.date.created).format("LL");
  let singleCrisis = `<div class="single-crisis" crisis-body="${data.body}">
  <h4 class="crisis-title">${data.title}</h4>
  <date class="crisis-date">${formatDate}</date>
  ${data["body-html"]}
  <button class="add-crisis-btn">add</button>
  <button class="cancel-crisis-btn">cancel</button>
  </div>`;
  $(".crisis-container").html(singleCrisis);
}
function createCrisis(newObject) {
  $.ajax({
    type: "POST",
    url: "/crisis/create",
    data: JSON.stringify(newObject),
    dataType: "json",
    contentType: "application/json"
  })
    .done(() => {
      $(".recent-crisis").hide();
      //changethis
      getMyCrisis("jojo");
      $(".my-crisis").show();
    })
    .fail(err => console.log(err));
}

// MY CRISIS FUNCTIONS
function getMyCrisis(user) {
  $.ajax({
    type: "GET",
    url: `/crisis-all/${user}`,
    dataType: "json",
    contentType: "application/json"
  })
    .done(result => renderMyCrisis(result))
    .fail(err => console.log(err));
}
function renderMyCrisis(data) {
  let myCrisis = [];
  for (let i in data) {
    myCrisis += `<div class="crisis-card" crisis-id="${data[i].id}">
    <h4>${data[i].title}</h4>
    <p>${data[i].date}</p>
    <button class="donate-btn">donate</button>
    <button class="delete-crisis-btn">delete</button>
    </div>`;
  }
  $(".my-crisis-container").html(myCrisis);
}
function deleteMyCrisis(id) {
  $.ajax({
    type: "DELETE",
    url: `/crisis/delete/${id}`,
    dataType: "json",
    contentType: "application/json"
  })
    .done(() => {
      const username = "jojo";
      getMyCrisis(username);
    })
    .fail(err => console.log(err));
}

// MY DONATION FUNCTIONS
function getMyDonation(user) {
  $.ajax({
    type: "GET",
    url: `/donation-all/${user}`,
    dataType: "json",
    contentType: "application/json"
  })
    .done(result => renderMyDonation(result))
    .fail(err => console.log(err));
}
function renderMyDonation(data) {
  let myDonation = [];
  for (let i in data) {
    myDonation += `<div class="crisis-card" donation-id="${data[i].id}">
    <h4>${data[i].title}</h4>
    <p>${data[i].confNum}</p>
    <p><strong>${data[i].amount}</strong> to ${data[i].charity}</p>
    <button class="update-donation-btn">update</button>
    <button class="delete-donation-btn">delete</button>
    </div>`;
  }
  $(".my-donation-container").html(myDonation);
}
function createMyDonation(newObject) {
  $.ajax({
    type: "PUT",
    url: `/donation/create/${newObject.id}`,
    data: JSON.stringify(newObject),
    dataType: "json",
    contentType: "application/json"
  })
    .done(() => {
      $(".my-crisis").hide();
      //changethis
      getMyDonation("jojo");
      $(".my-donations").show();
    })
    .fail(err => console.log(err));
}
function updateMyDonation(updateObject) {
  $.ajax({
    type: "PUT",
    url: `/donation/update/${updateObject.id}`,
    data: JSON.stringify(updateObject),
    dataType: "json",
    contentType: "application/json"
  })
    .done(() => {
      $(".donation-update-page").hide();
      //changethis
      getMyDonation("jojo");
      $(".my-donation-container").show();
    })
    .fail(err => console.log(err));
}
function deleteMyDonation(id) {
  $.ajax({
    type: "DELETE",
    url: `/donation/delete/${id}`,
    dataType: "json",
    contentType: "application/json"
  })
    .done(() => {
      const username = "jojo";
      getMyDonation(username);
    })
    .fail(err => console.log(err));
}

$(document).ready(() => {
  // handle when user clicks register
  //   $("#register").on("click", () => {
  //     $(".landing-page").hide();
  //     $(".register-page").show();
  //     $(".login-page").hide();
  //   });
  //handle when user clicks login
  //   $("#login").on("click", () => {
  //     $(".landing-page").hide();
  //     $(".register-page").hide();
  //     $(".login-page").show();
  //   });
  // handle user registration
  //   $(".register-form").submit(e => {
  //     e.preventDefault();
  //     const firstname = $("#registerFirstName").val();
  //     const lastname = $("#registerLastName").val();
  //     const username = $("#registerUserName").val();
  //     const email = $("#registerEmail").val();
  //     const password = $("#registerPassword").val();
  //     const confPassword = $("#confirmPassword").val();
  //     if (firstname == "") alert("Please enter your first name");
  //     else if (lastname == "") alert("Please enter your last name");
  //     else if (username == "") alert("Please enter your user name");
  //     else if (email == "") alert("Please enter your email");
  //     else if (password == "") alert("Please enter your password");
  //     else if (confPassword != password) alert("Password do not match");
  //     else {
  //       const newUserObj = {
  //         firstname: firstname,
  //         lastname: lastname,
  //         username: username,
  //         email: email,
  //         password: password
  //       };
  //       $.ajax({
  //         type: "POST",
  //         url: "/users/register",
  //         dataType: "json",
  //         data: JSON.stringify(newUserObj),
  //         contentType: "application/json"
  //       })
  //         .done(result => {
  //           $(".register-page").hide();
  //           $(".headbar").hide();
  //           $(".main-page").show();
  //         })
  //         .fail(error => console.log(error));
  //     }
  //   });
  // handle user login
  //   $(".login-form").submit(e => {
  //     e.preventDefault();
  //     const username = $("#loginUserName").val();
  //     const password = $("#loginPassword").val();
  //     console.log(password);
  //     if (username == "") alert("Please enter your username");
  //     else if (password == "") alert("Please enter your password");
  //     else {
  //       const loginUserObj = { username: username, password: password };
  //       $.ajax({
  //         type: "POST",
  //         url: "/users/login",
  //         dataType: "json",
  //         data: JSON.stringify(loginUserObj),
  //         contentType: "application/json"
  //       })
  //         .done(result => {
  //           $(".login-page").hide();
  //           $(".headbar").hide();
  //           $(".main-page").show();
  //         })
  //         .fail(error => {
  //           console.log(error);
  //           alert("Incorrect username or password");
  //         });
  //     }
  //   });

  // handle user account details
  $("#account").on("click", () => {
    $(".recent-crisis").hide();
    $(".my-crisis").hide();
    $(".my-donation").hide();
    $(".my-account").show();
    //changethis
    let myUserName = "jojo";
    getMyAccount(myUserName);
  });

  //handle when user clicks recent crisis
  $("#new-crisis").on("click", () => {
    $(".my-crisis").hide();
    $(".my-donation").hide();
    $(".my-account").hide();
    populateRecentCrisis();
    $(".recent-crisis").show();
  });

  populateRecentCrisis();

  // handle user recent crisis queries
  $(".search-btn").on("click", () => {
    const query = $("#searchCrisis").val();
    searchRecentCrisis(query);
  });

  // handle crisis read more
  $(".crisis-container").on("click", ".read-more", e => {
    let crisisID = $(e.currentTarget)
      .closest(".crisis-card")
      .attr("crisis-id");
    crisisReadMore(crisisID);
  });

  //handle crisis addition
  $(".crisis-container").on("click", ".add-crisis-btn", e => {
    const title = $(e.currentTarget)
      .closest(".single-crisis")
      .children(".crisis-title")
      .text();
    const date = $(e.currentTarget)
      .closest(".single-crisis")
      .children(".crisis-date")
      .text();
    const details = $(e.currentTarget)
      .closest(".single-crisis")
      .attr("crisis-body");
    const formatDate = moment(date).format("LL");
    const newCrisisObject = {
      title: title,
      date: formatDate,
      details: details,
      donor: "jojo"
    };
    createCrisis(newCrisisObject);
  });

  // handle add crisis cancellation
  $(".crisis-container").on("click", ".cancel-crisis-btn", () => {
    populateRecentCrisis();
  });

  // handle when user click my crisis
  $("#crisis").on("click", () => {
    $(".recent-crisis").hide();
    $(".my-donation").hide();
    $(".my-account").hide();
    $(".my-crisis").show();
    //changethis
    let myUserName = "jojo";
    getMyCrisis(myUserName);
  });

  // handle when user want to delete their crisis
  $(".my-crisis").on("click", ".delete-crisis-btn", e => {
    let IDtoDelete = $(e.currentTarget)
      .closest(".crisis-card")
      .attr("crisis-id");
    deleteMyCrisis(IDtoDelete);
  });

  // handle when user want to donate
  $(".my-crisis").on("click", ".donate-btn", e => {
    const title = $(e.currentTarget)
      .closest(".crisis-card")
      .children("h4")
      .text();
    const date = $(e.currentTarget)
      .closest(".crisis-card")
      .children("date")
      .text();
    const id = $(e.currentTarget)
      .closest(".crisis-card")
      .attr("crisis-id");
    $(".my-crisis-container").hide();
    $(".donation-page").show();
    $("#crisisTitleDP").html(title);
    $("#crisisDateDP").html(date);
    $("#IDkeeper").attr("crisis-id", id);
  });
  // handle when user create donation
  $(".donation-form").submit(e => {
    e.preventDefault();
    const id = $("#IDkeeper").attr("crisis-id");
    const charity = $("#charityName").val();
    const amount = $("#donationAmount").val();
    const confNum = $("#confirmationNumber").val();
    const created = moment().format("L");
    const newDonationObject = {
      id: id,
      charity: charity,
      amount: amount,
      confNum: confNum,
      created: created,
      donated: true
    };
    createMyDonation(newDonationObject);
  });
  // handle when user cancel donation
  $(".my-crisis").on("click", ".cancel-donation-btn", e => {
    e.preventDefault();
    $(".my-crisis-container").show();
    $(".donation-page").hide();
  });

  //====== MY DONATIONS PAGE HANDLERS ======
  // When User Clicks "MY DONATIONS LINK"
  $("#donations").on("click", () => {
    $(".recent-crisis").hide();
    $(".my-account").hide();
    $(".my-crisis").hide();
    $(".my-donation").show();
    //changethis
    let myUserName = "jojo";
    getMyDonation(myUserName);
  });

  // When User Clicks "UPDATE-BUTTON" button on "MY DONATIONS"
  $(".my-donation").on("click", ".update-donation-btn", e => {
    const id = $(e.currentTarget)
      .closest(".crisis-card")
      .attr("donation-id");
    $(".my-donation-container").hide();
    $(".donation-update-page").show();
    $("#IDUpdater").attr("donation-id", id);
  });

  // When User Clicks "DELETE-BUTTON" on "MY DONATIONS"
  $(".my-donation").on("click", ".delete-donation-btn", e => {
    let IDtoDelete = $(e.currentTarget)
      .closest(".crisis-card")
      .attr("donation-id");
    deleteMyDonation(IDtoDelete);
  });

  // When User Clicks "SUBMIT-BUTTON" on "DONATION UPDATE FORM"
  $(".donation-update-form").submit(e => {
    e.preventDefault();
    const id = $("#IDUpdater").attr("donation-id");
    const charity = $("#charityUpdate").val();
    const amount = $("#amountUpdate").val();
    const confNum = $("#confNumUpdate").val();
    const created = moment().format("L");
    const updateObject = {
      id: id,
      charity: charity,
      amount: amount,
      confNum: confNum,
      created: created
    };
    updateMyDonation(updateObject);
  });

  // When User Clicks "CANCEL-BUTTON" on "DONATION UPDATE FORM"
  $(".my-donation").on("click", ".cancel-update-btn", e => {
    e.preventDefault();
    $(".my-donation-container").show();
    $(".donation-update-page").hide();
  });
});
