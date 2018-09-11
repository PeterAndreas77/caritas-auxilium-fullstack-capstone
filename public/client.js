"use strict";

//====== RECENT CRISIS FUNCTIONS ======
// Function to Populate User Dashboard with 10 Latest Crisis
function populateRecentCrisis() {
  // Make an AJAX Call to ReliefWebAPI
  $.ajax({
    type: "GET",
    url: `https://api.reliefweb.int/v1/reports?appname=caritas`,
    data: { preset: "latest" },
    dataType: "json",
    contentType: "application/json"
  })
    // If Done, Render the Result
    .done(result => renderRecentCrisis(result))
    // If Fail, Log the Error
    .fail(err => console.log(err));
}

// Function to Search for a Specific Term
function searchRecentCrisis(term) {
  // Make an AJAX Call to ReliefWebAPI with Search Term in Request Body
  $.ajax({
    type: "GET",
    url: `https://api.reliefweb.int/v1/reports?appname=caritas`,
    data: { query: { value: term }, preset: "latest" },
    dataType: "json",
    contentType: "application/json"
  })
    // If Done, Render the Result
    .done(result => renderRecentCrisis(result))
    // If Fail, Log the Error
    .fail(err => console.log(err));
}

// Function to Render the Returned JSON Object from ReliefWebAPI to the Page
function renderRecentCrisis(result) {
  // Initialize Result as Data and Setup an Empty Array
  const data = result.data;
  let recentCrisis = [];
  // For Each Index in Data, Add them to the Array
  for (let i in data) {
    recentCrisis += `<div class="crisis-card" crisis-id="${data[i].id}">
    <p>${data[i].fields.title}</p>
    <a href="#" class="read-more">${data[i].href}</a>
    </div>`;
  }
  // Render the Array into Crisis Container
  $(".crisis-container").html(recentCrisis);
}

//====== SINGLE CRISIS FUNCTIONS ======
// Function to Get More Details of a Single Crisis
function crisisReadMore(id) {
  // Make an AJAX Call to ReliefWeb Reports with the ID
  $.ajax({
    type: "GET",
    url: `https://api.reliefweb.int/v1/reports/${id}`,
    dataType: "json",
    contentType: "application/json"
  })
    // If Done, Render the Result
    .done(result => renderSingleCrisis(result))
    // If Fail, Log the Error
    .fail(err => console.log(err));
}

// Function to Render a Single Crisis to the Page
function renderSingleCrisis(result) {
  // Grab the First Index [0] of the Returned JSON Object or else Undefined
  const data = result.data[0].fields;
  // Format the Date to be Readable
  let formatDate = moment(data.date.created).format("LL");
  // Initialize the Template String to be Inserted into the DOM
  let singleCrisis = `<div class="single-crisis" crisis-body="${data.body}">
  <h4 class="crisis-title">${data.title}</h4>
  <date class="crisis-date">${formatDate}</date>
  ${data["body-html"]}
  <button class="add-crisis-btn">add</button>
  <button class="cancel-crisis-btn">cancel</button>
  </div>`;
  // Insert Single Crisis into the DOM
  $(".crisis-container").html(singleCrisis);
}

// Function to Create Chosen Crisis into the Database
function createCrisis(newObject) {
  // Make a POST Request to our Endpoint
  $.ajax({
    type: "POST",
    url: "/crisis/create",
    data: JSON.stringify(newObject),
    dataType: "json",
    contentType: "application/json"
  })
    // If the request is Successful
    .done(() => {
      // Hide recent-crisis
      $(".recent-crisis").hide();
      //changethis
      getMyCrisis("jojo");
      // Show my-crisis
      $(".my-crisis").show();
    })
    // If the Request Failed, Log the Error
    .fail(err => console.log(err));
}

//====== MY CRISIS FUNCTIONS ======
// Function to Get Logged User Crisis from the Database
function getMyCrisis(user) {
  // Make a GET Request to our Endpoint
  $.ajax({
    type: "GET",
    url: `/crisis-all/${user}`,
    dataType: "json",
    contentType: "application/json"
  })
    // If Request is Successful, Render the Result
    .done(result => renderMyCrisis(result))
    // If the Request Failed, Log the Error
    .fail(err => console.log(err));
}

// Function to Render User's Crisis to the Page
function renderMyCrisis(data) {
  // Setup an Empty Array
  let myCrisis = [];
  // For Each Index in the Data, Add them to the Array
  for (let i in data) {
    myCrisis += `<div class="crisis-card" crisis-id="${data[i].id}">
    <h4>${data[i].title}</h4>
    <p>${data[i].date}</p>
    <button class="donate-btn">donate</button>
    <button class="delete-crisis-btn">delete</button>
    </div>`;
  }
  // Insert the Array into the Container inside the DOM
  $(".my-crisis-container").html(myCrisis);
}

// Function to Delete a User's Crisis from the Database
function deleteMyCrisis(id) {
  // Make a DELETE Request to our Endpoint with the Crisis ID
  $.ajax({
    type: "DELETE",
    url: `/crisis/delete/${id}`,
    dataType: "json",
    contentType: "application/json"
  })
    // If Request is Successful
    .done(() => {
      // Rerender the Page
      //changethis
      const username = "jojo";
      getMyCrisis(username);
    })
    // If the Request Failed, Log the Error
    .fail(err => console.log(err));
}

//====== MY DONATION FUNCTIONS ======
// Function to Get User's Donation from the Database
function getMyDonation(user) {
  // Make a GET Request to our Endpoint
  $.ajax({
    type: "GET",
    url: `/donation-all/${user}`,
    dataType: "json",
    contentType: "application/json"
  })
    // If Request is Successful, Render the Result
    .done(result => renderMyDonation(result))
    // If Request Failed, Log the Error
    .fail(err => console.log(err));
}

// Function to Render User's Donations to the Page
function renderMyDonation(data) {
  // Setup an Empty Array
  let myDonation = [];
  // For each Index in Data, Add them to the Array
  for (let i in data) {
    myDonation += `<div class="crisis-card" donation-id="${data[i].id}">
    <h4>${data[i].title}</h4>
    <p>${data[i].confNum}</p>
    <p><strong>${data[i].amount}</strong> to ${data[i].charity}</p>
    <button class="update-donation-btn">update</button>
    <button class="delete-donation-btn">delete</button>
    </div>`;
  }
  // Insert the Array into the Container inside the DOM
  $(".my-donation-container").html(myDonation);
}

// Function to Create a New Donation into the Database
function createMyDonation(newObject) {
  // Make a PUT Request to the Database with the ID
  $.ajax({
    type: "PUT",
    url: `/donation/create/${newObject.id}`,
    data: JSON.stringify(newObject),
    dataType: "json",
    contentType: "application/json"
  })
    // If Request is Successful
    .done(() => {
      // Hide my-crisis
      $(".my-crisis").hide();
      //changethis
      let loggedInUser = "jojo";
      // Render User Donations
      getMyDonation(loggedInUser);
      // Show my-donations
      $(".my-donation").show();
    })
    // If Request Failed, Log the Error
    .fail(err => console.log(err));
}

// Function to Update User's Donation
function updateMyDonation(updateObject) {
  // Again, Make PUT Request to the Database with the ID
  $.ajax({
    type: "PUT",
    url: `/donation/update/${updateObject.id}`,
    data: JSON.stringify(updateObject),
    dataType: "json",
    contentType: "application/json"
  })
    // If Request is Successful
    .done(() => {
      // Hide donation-update-page
      $(".donation-update-page").hide();
      //changethis
      let loggedInUser = "jojo";
      // Rerender User's Donations
      getMyDonation(loggedInUser);
      // Show my-donation-container
      $(".my-donation-container").show();
    })
    .fail(err => console.log(err));
}

// Function to Delete User's Donation
function deleteMyDonation(id) {
  // Make a DELETE Request to the Database with the ID
  $.ajax({
    type: "DELETE",
    url: `/donation/delete/${id}`,
    dataType: "json",
    contentType: "application/json"
  })
    // If Request is Successful
    .done(() => {
      //changethis
      let loggedInUser = "jojo";
      // Rerender User's Donations
      getMyDonation(loggedInUser);
    })
    // If Request Failed, Log the Error
    .fail(err => console.log(err));
}

//====== MY ACCOUNT FUNCTIONS ======
// Function to Get User's Account Details from the Database
function getMyAccount(myName) {
  // Make a GET Request with the Logged In UserName
  $.ajax({
    type: "GET",
    url: `/user/${myName}`,
    dataType: "json",
    contentType: "application/json"
  })
    // If Request is Successful, Render the Result
    .done(result => renderMyAccount(result))
    // If Request Failed, Log the Error
    .fail(err => console.log(err));
}

function updateMyAccount(updateObject) {
  // Make a PUT Request to User Endpoint
  $.ajax({
    type: "PUT",
    url: `/user/update/${updateObject.username}`,
    data: JSON.stringify(updateObject),
    dataType: "json",
    contentType: "application/json"
  })
    // If Request is Successful
    .done(() => {
      // Hide account-update-page
      $(".account-update-page").hide();
      //changethis
      let loggedInUser = "jojo";
      // Rerender User's Account Info
      getMyAccount(loggedInUser);
      // Show my-account-container
      $(".my-account-container").show();
    })
    // If Request Failed, Log the Error
    .fail(err => console.log(err));
}

// Function to Render User's Account Details to the Page
function renderMyAccount(userData) {
  // Initialize the String Template
  const myAccountInfo = `<p>Avatar</p>
  <img src="https://via.placeholder.com/150x150" class="user-avatar" alt="User Avatar">
  <p>First Name: ${userData.firstname}</p>
  <p>Last Name: ${userData.lastname}</p>
  <p>User Name: ${userData.username}</p>
  <p>Email: ${userData.email}</p>
  <button class="account-update-btn">update</button>`;
  //Insert User Info into the DOM
  $(".my-account-container").html(myAccountInfo);
}

//====== MY REPORT FUNCTIONS ======
// Function to Pull User Report from the Database
function pullReport(year) {
  //changethis
  let loggedInUser = "jojo";
  // Make a GET Request with the Logged In UserName
  $.ajax({
    type: "GET",
    url: `/report/${loggedInUser}`,
    dataType: "json",
    contentType: "application/json"
  })
    // If Request is Successful, Render the Result
    .done(result => renderReport(result, year))
    // If Request Failed, Log the Error
    .fail(err => console.log(err));
}
// Function to Render User Report to the Page
function renderReport(result, year) {
  const data = result[0];
  let ctx = document.getElementById("myChart").getContext("2d");
  let myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: [moment.monthsShort(data._id.month - 1)],
      datasets: [
        {
          label: " Amount of Donations per Month",
          data: [data.total],
          backgroundColor: ["rgba(232, 74, 95, 0.2)"],
          borderColor: ["rgba(232, 74, 95, 1)"],
          borderWidth: 1
        }
      ]
    }
  });
}

$(document).ready(() => {
  //====== LANDING PAGE HANDLERS ======
  // handle when user clicks home
  $("#home").on("click", () => {
    $(".landing-page").show();
    $(".register-page").hide();
    $(".login-page").hide();
  });

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
          //===WHEN USER LOGGED IN OR SUCCESFULLY REGISTER, WE CALL THIS FUNCTION
          populateRecentCrisis();
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
          //===WHEN USER LOGGED IN OR SUCCESFULLY REGISTER, WE CALL THIS FUNCTION
          populateRecentCrisis();
          $(".main-page").show();
        })
        .fail(error => {
          console.log(error);
          alert("Incorrect username or password");
        });
    }
  });

  //====== RECENT CRISIS PAGE HANDLERS ======
  // When User Clicks "RECENT CRISIS LINK"
  $("#new-crisis").on("click", () => {
    // Hide other Sections
    $(".my-crisis").hide();
    $(".my-donation").hide();
    $(".my-account").hide();
    $(".my-report").hide();
    // Populate and Show Recent Crisis
    populateRecentCrisis();
    $(".recent-crisis").show();
  });

  // When User SEARCH for CRISIS
  $(".search-btn").on("click", () => {
    // Get the Value and Pass it to Search Function
    const query = $("#searchCrisis").val();
    searchRecentCrisis(query);
  });

  // When User Clicks on a CRISIS LINK to READ MORE
  $(".crisis-container").on("click", ".read-more", e => {
    // Get the ID and Pass it to ReadMore Function
    let crisisID = $(e.currentTarget)
      .closest(".crisis-card")
      .attr("crisis-id");
    crisisReadMore(crisisID);
  });

  // When User Clicks "ADD-BUTTON" on a SINGLE CRISIS
  $(".crisis-container").on("click", ".add-crisis-btn", e => {
    // Get the Values from Input Fields
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
    // Store Date in Formatted Forms
    const formatDate = moment(date).format("LL");
    // Create a New Object to Pass on
    const newCrisisObject = {
      title: title,
      date: formatDate,
      details: details,
      donor: "jojo"
    };
    // Pass the Object as a New Crisis
    createCrisis(newCrisisObject);
  });

  // When User Clicks "CANCEL-BUTTON" on a SINGLE CRISIS
  $(".crisis-container").on("click", ".cancel-crisis-btn", () => {
    // Repopulate crisis-container with Recent Crisis
    populateRecentCrisis();
  });

  //====== MY CRISIS PAGE HANDLERS ======
  // When Users Clicks "MY CRISIS LINK"
  $("#crisis").on("click", () => {
    // Hide other Sections
    $(".recent-crisis").hide();
    $(".my-donation").hide();
    $(".my-account").hide();
    $(".my-report").hide();
    // Show and Render User's Crisis
    $(".my-crisis").show();
    $(".my-crisis-container").show();
    $(".donation-page").hide();
    //changethis
    let loggedInUser = "jojo";
    getMyCrisis(loggedInUser);
  });

  // When Users Clicks "DONATE-BUTTON" on "MY CRISIS"
  $(".my-crisis").on("click", ".donate-btn", e => {
    // Get the Values from rendered DOM
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
    // Hide my-crisis-container
    $(".my-crisis-container").hide();
    // Show donation-page
    $(".donation-page").show();
    $(".my-donation-page").show();
    $(".donation-update-page").hide();
    // Pass the Values to donation-page
    $("#crisisTitleDP").html(title);
    $("#crisisDateDP").html(date);
    $("#IDkeeper").attr("crisis-id", id);
  });

  // When User Clicks "DELETE-BUTTON" on "MY CRISIS"
  $(".my-crisis").on("click", ".delete-crisis-btn", e => {
    // Get the ID from Targeted Crisis Card
    let IDtoDelete = $(e.currentTarget)
      .closest(".crisis-card")
      .attr("crisis-id");
    // Pass the ID to Delete that Crisis
    deleteMyCrisis(IDtoDelete);
  });

  // When User Clicks "SUBMIT-BUTTON" to DONATE
  $(".donation-form").submit(e => {
    // Prevent Bubbling
    e.preventDefault();
    // Get the Values from Input Fields
    const id = $("#IDkeeper").attr("crisis-id");
    const charity = $("#charityName").val();
    const amount = $("#donationAmount").val();
    const confNum = $("#confirmationNumber").val();
    const created = moment().format("L");
    // Create New Donation Object to Pass on
    const newDonationObject = {
      id: id,
      charity: charity,
      amount: amount,
      confNum: confNum,
      created: created,
      donated: true
    };
    // Pass Donation Object to be Stored in the Database
    createMyDonation(newDonationObject);
  });

  // When User Clicks "CANCEL-BUTTON" to CANCEL DONATE
  $(".my-crisis").on("click", ".cancel-donation-btn", e => {
    // Prevent Bubbling
    e.preventDefault();
    $("#charityName").val("");
    $("#donationAmount").val("");
    $("#confirmationNumber").val("");
    // Show my-crisis-container
    $(".my-crisis-container").show();
    // Hide donation-page
    $(".donation-page").hide();
  });

  //====== MY DONATIONS PAGE HANDLERS ======
  // When User Clicks "MY DONATIONS LINK"
  $("#donations").on("click", () => {
    // Hide Other Sections
    $(".recent-crisis").hide();
    $(".my-account").hide();
    $(".my-crisis").hide();
    $(".my-report").hide();
    // Show and Render User's Donations
    $(".my-donation").show();
    //changethis
    let loggedInUser = "jojo";
    getMyDonation(loggedInUser);
  });

  // When User Clicks "UPDATE-BUTTON" button on "MY DONATIONS"
  $(".my-donation").on("click", ".update-donation-btn", e => {
    // Get the ID from the Rendered Donation
    const id = $(e.currentTarget)
      .closest(".crisis-card")
      .attr("donation-id");
    // Hide my-donation-container
    $(".my-donation-container").hide();
    // Show donation-update-page
    $(".donation-update-page").show();
    // Pass the ID to donation-update-page
    $("#IDUpdater").attr("donation-id", id);
  });

  // When User Clicks "DELETE-BUTTON" on "MY DONATIONS"
  $(".my-donation").on("click", ".delete-donation-btn", e => {
    // Get the ID from the donation-card
    const IDtoDelete = $(e.currentTarget)
      .closest(".crisis-card")
      .attr("donation-id");
    // Pass the ID to Delete the Donation
    deleteMyDonation(IDtoDelete);
  });

  // When User Clicks "SUBMIT-BUTTON" on "DONATION UPDATE FORM"
  $(".donation-update-form").submit(e => {
    // Prevent Bubbling
    e.preventDefault();
    // Get the Values from Field Inputs
    const id = $("#IDUpdater").attr("donation-id");
    const charity = $("#charityUpdate").val();
    const amount = $("#amountUpdate").val();
    const confNum = $("#confNumUpdate").val();
    const created = moment().format("L");
    // Create Update Object to Pass on
    const updateObject = {
      id: id,
      charity: charity,
      amount: amount,
      confNum: confNum,
      created: created
    };
    // Pass UpdateObject to Update the Donation
    updateMyDonation(updateObject);
  });

  // When User Clicks "CANCEL-BUTTON" on "DONATION UPDATE FORM"
  $(".my-donation").on("click", ".cancel-update-btn", e => {
    // Prevent Bubbling
    e.preventDefault();
    // Show my-donation-container
    $(".my-donation-container").show();
    // Hide donation-update-page
    $(".donation-update-page").hide();
  });

  //====== MY ACCOUNT PAGE HANDLERS ======
  // When User Clicks "MY ACCOUNT LINK"
  $("#account").on("click", () => {
    // Hide Other Sections
    $(".recent-crisis").hide();
    $(".my-crisis").hide();
    $(".my-donation").hide();
    $(".my-report").hide();
    // Show and Render User's Account Info
    $(".my-account").show();
    //changethis
    let loggedInUser = "jojo";
    getMyAccount(loggedInUser);
  });

  // When User Clicks "UPDATE BUTTON" on "MY ACCOUNT"
  $(".my-account").on("click", ".account-update-btn", () => {
    $(".my-account-container").hide();
    $(".account-update-page").show();
  });

  // When User Clicks "SUBMIT BUTTON" on "ACCOUNT UPDATE FORM"
  $(".account-update-form").submit(e => {
    // Prevent Bubbling
    e.preventDefault();
    // Get the Values from Field Inputs
    const firstname = $("#updateFirstName").val();
    const lastname = $("#updateLastName").val();
    const email = $("#updateEmail").val();
    //changethis
    let loggedInUser = "jojo";
    // Create Update Object to Pass on
    const updateObject = {
      username: loggedInUser,
      firstname: firstname,
      lastname: lastname,
      email: email
    };
    console.log(loggedInUser);
    // Pass UpdateObject to Update User's Account
    updateMyAccount(updateObject);
  });

  // When User Clicks "CANCEL BUTTON" on "ACCOUNT UPDATE FORM"
  $(".my-account").on("click", ".cancel-account-update", e => {
    e.preventDefault();
    $(".account-update-page").hide();
    $(".my-account-container").show();
  });

  //====== MY REPORT PAGE HANDLERS ======
  // When User Clicks "MY REPORT LINK"
  $("#reports").on("click", () => {
    // Hide Other Sections
    $(".recent-crisis").hide();
    $(".my-crisis").hide();
    $(".my-donation").hide();
    $(".my-account").hide();
    // Show and Render User's Report
    $(".my-report").show();
    //changethis
    let loggedInUser = "jojo";
    getMyAccount(loggedInUser);
  });
  // When User Clicks "SEARCH BUTTON" on "MY REPORT"
  $(".pull-report-btn").on("click", () => {
    // Get the Value and Pass it to Pull Report Function
    const reportYear = parseInt($("#reportYear").val(), 10);
    pullReport(reportYear);
  });
});
