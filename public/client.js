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
    recentCrisis += `<div class="donation-card" crisis-id="${data[i].id}">
    <p>${data[i].fields.title}</p>
    <p href="#" class="read-more button">read more</p>
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
  <button class="donate-crisis-btn">donate</button>
  <button class="cancel-crisis-btn">cancel</button>
  </div>`;
  // Insert Single Crisis into the DOM
  $(".crisis-container").html(singleCrisis);
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
    let formattedDate = moment(data[i].created).format("LL");
    myDonation += `<div class="donation-card" donation-id="${data[i].id}">
    <h4 class="donation-title">${data[i].title}</h4>
    <p class='donation-date'>Created: ${formattedDate}</p>
    <p>Confirmation #: ${data[i].confNum}</p>
    <p>$<strong>${data[i].amount}</strong> to ${data[i].charity}</p>
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
    type: "POST",
    url: `/donation/create`,
    data: JSON.stringify(newObject),
    dataType: "json",
    contentType: "application/json"
  })
    // If Request is Successful
    .done(() => {
      // Hide recent-crisis
      $(".recent-crisis").hide();
      const loggedInUser = localStorage.getItem("loggedInUser");
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
      const loggedInUser = localStorage.getItem("loggedInUser");
      // Rerender User's Donations
      getMyDonation(loggedInUser);
      // Show my-donation-container
      $(".my-donation-container").show();
    })
    .fail(err => console.log(err));
}

// Function to Search for My Donations
function searchMyDonation(user, term) {
  // Make an AJAX Call to ReliefWebAPI with Search Term in Request Body
  $.ajax({
    type: "GET",
    url: `/donation/search/${user}/${term}`,
    dataType: "json",
    contentType: "application/json"
  })
    // If Done, Render the Result
    .done(result => {
      if (!$.isArray(result) || !result.length) {
        $("#searchMyDonation").val("");
        alert("no result");
      } else {
        $(".donation-update-page").hide();
        $(".my-donation-container").show();
        renderMyDonation(result);
      }
    })
    // If Fail, Log the Error
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
      const loggedInUser = localStorage.getItem("loggedInUser");
      // Rerender User's Donations
      getMyDonation(loggedInUser);
    })
    // If Request Failed, Log the Error
    .fail(err => console.log(err));
}

//====== MY ACCOUNT FUNCTIONS ======
// Function to Get User's Account Details from the Database
function getMyAccount(loggedInUser) {
  // Make a GET Request with the Logged In UserName
  $.ajax({
    type: "GET",
    url: `/user/${loggedInUser}`,
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
      const loggedInUser = localStorage.getItem("loggedInUser");
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
  const myAccountInfo = `
  <div class="account-card">
  <p>First Name: ${userData.firstname}</p>
  <p>Last Name: ${userData.lastname}</p>
  <p>User Name: ${userData.username}</p>
  <p>Email: ${userData.email}</p>
  </div>
  <button class="account-update-btn">update</button>`;
  //Insert User Info into the DOM
  $(".my-account-container").html(myAccountInfo);
}

//====== MY REPORT FUNCTIONS ======
// Function to Pull User Report from the Database
function pullReport(year) {
  const loggedInUser = localStorage.getItem("loggedInUser");
  // Make a GET Request with the Logged In UserName
  $.ajax({
    type: "GET",
    url: `/report/${loggedInUser}/${year}`,
    dataType: "json",
    contentType: "application/json"
  })
    // If Request is Successful, Render the Result
    .done(result => renderReport(result, year))
    // If Request Failed, Log the Error
    .fail(err => console.log(err));
}
// Function to Render User Report to the Page
function renderReport(result) {
  // Initialize an Empty Array to use as a template
  let monthArray = {
    Jan: 0,
    Feb: 0,
    Mar: 0,
    Apr: 0,
    May: 0,
    Jun: 0,
    Jul: 0,
    Aug: 0,
    Sep: 0,
    Oct: 0,
    Nov: 0,
    Dec: 0
  };
  // Loop through every month keys in the array
  for (let key in monthArray) {
    // For every index in result
    for (let i = 0; i < result.length; i++) {
      // If the index month matches the key in month array
      if (moment.monthsShort(result[i]._id.month - 1) == key) {
        // Then the value of the key is the total value in result
        monthArray[key] = result[i].total;
      }
    }
  }
  // Grab element to render the chart to
  let ctx = document.getElementById("myChart").getContext("2d");
  let myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(monthArray),
      datasets: [
        {
          label: " Amount of Donations per Month (US$)",
          data: Object.values(monthArray),
          backgroundColor: ["rgba(57, 62, 70, 0.2)"],
          borderColor: ["rgba(57, 62, 70, 1)"],
          borderWidth: 1
        }
      ]
    }
  });
}

$(document).ready(() => {
  //====== LANDING PAGE HANDLERS ======
  // Scroll Reveal on Certain Lines
  ScrollReveal().reveal(".revealed", {
    origin: "left",
    delay: 200,
    distance: "100%",
    easing: "ease-in"
  });

  // When User Clicks "HOME"
  $("#home").on("click", () => {
    $(".landing-page").show();
    $(".register-page").hide();
    $(".login-page").hide();
  });

  // When User Clicks "REGISTER"
  $("#register").on("click", () => {
    $(".landing-page").hide();
    $(".register-page").show();
    $(".login-page").hide();
  });

  // When User Clicks "LOGIN"
  $("#login").on("click", () => {
    $(".landing-page").hide();
    $(".register-page").hide();
    $(".login-page").show();
  });

  // HANDLE REGISTRATION FORM SUBMISSION
  $(".register-form").submit(e => {
    e.preventDefault();
    // Grab the values from the registration form
    const firstname = $("#registerFirstName").val();
    const lastname = $("#registerLastName").val();
    const username = $("#registerUserName").val();
    const email = $("#registerEmail").val();
    const password = $("#registerPassword").val();
    const confPassword = $("#confirmPassword").val();
    // Check to see if all the values are entered
    if (firstname == "") alert("Please enter your first name");
    else if (lastname == "") alert("Please enter your last name");
    else if (username == "") alert("Please enter your user name");
    else if (email == "") alert("Please enter your email");
    else if (password == "") alert("Please enter your password");
    else if (confPassword != password) alert("Password do not match");
    // If all values are entered, create a new user object
    else {
      const newUserObj = {
        firstname: firstname,
        lastname: lastname,
        username: username,
        email: email,
        password: password
      };
      // Make a post request and send the object to user endpoint
      $.ajax({
        type: "POST",
        url: "/users/register",
        dataType: "json",
        data: JSON.stringify(newUserObj),
        contentType: "application/json"
      })
        .done(result => {
          // When done, hide outer pages
          $(".landing-page").hide();
          $(".outside-collapsible").hide();
          $(".register-page").hide();
          // Set logged in username in local storage
          localStorage.setItem("loggedInUser", result.username);
          $(".my-username").html(result.username);
          // Populate the Main Page and Show Relevant Pages
          populateRecentCrisis();
          $(".main-page").show();
          $(".welcome").show();
          $(".inside-collapsible").show();
        })
        .fail(error => console.log(error));
    }
  });

  // HANDLE USER LOGIN
  $(".login-form").submit(e => {
    e.preventDefault();
    // Grab the values from Login Form
    const username = $("#loginUserName").val();
    const password = $("#loginPassword").val();
    // Check to see if the values are entered
    if (username == "") alert("Please enter your username");
    else if (password == "") alert("Please enter your password");
    else {
      // If all values are entered, make a login object
      const loginUserObj = { username: username, password: password };
      // Send the login object by making a post request to user endpoint
      $.ajax({
        type: "POST",
        url: "/users/login",
        dataType: "json",
        data: JSON.stringify(loginUserObj),
        contentType: "application/json"
      })
        .done(result => {
          // When done, hide outer pages
          $(".landing-page").hide();
          $(".login-page").hide();
          $(".outside-collapsible").hide();
          // Set logged in username in the local storage
          localStorage.setItem("loggedInUser", result.username);
          $(".my-username").html(result.username);
          // Populate the main page and show relevant pages
          populateRecentCrisis();
          $(".main-page").show();
          $(".welcome").show();
          $(".inside-collapsible").show();
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
    $(".my-donation").hide();
    $(".my-account").hide();
    $(".my-report").hide();
    // Populate and Show Recent Crisis
    populateRecentCrisis();
    $(".recent-crisis").show();
  });

  // When User SEARCH for CRISIS
  $(".search-recent").on("click", () => {
    // Get the Value and Pass it to Search Function
    const query = $("#searchCrisis").val();
    searchRecentCrisis(query);
  });

  // When User Clicks on a CRISIS LINK to READ MORE
  $(".crisis-container").on("click", ".read-more", e => {
    // Get the ID and Pass it to ReadMore Function
    let crisisID = $(e.currentTarget)
      .closest(".donation-card")
      .attr("crisis-id");
    crisisReadMore(crisisID);
  });

  // When User Clicks "CANCEL-BUTTON" on a SINGLE CRISIS
  $(".crisis-container").on("click", ".cancel-crisis-btn", () => {
    populateRecentCrisis();
  });

  // When Users Clicks "DONATE-BUTTON" on "SINGLE CRISIS"
  $(".crisis-container").on("click", ".donate-crisis-btn", e => {
    // Get the Values from rendered DOM
    const title = $(e.currentTarget)
      .closest(".single-crisis")
      .children(".crisis-title")
      .text();
    const date = $(e.currentTarget)
      .closest(".single-crisis")
      .children(".crisis-date")
      .text();
    // Reset the ID
    $(e.currentTarget)
      .closest(".donation-card")
      .attr("crisis-id", "");
    // Hide crisis-container
    $(".crisis-container").hide();
    // Show donation-page
    $(".donation-page").show();
    // Pass the Values to donation-page
    $("#crisisTitle").html(title);
    $("#crisisDate").html(date);
  });

  // When User Clicks "SUBMIT-BUTTON" to DONATE
  $(".donation-form").submit(e => {
    // Prevent Bubbling
    e.preventDefault();
    // Get the Values from Input Fields
    const title = $("#crisisTitle").text();
    const charity = $("#charityName").val();
    const amount = $("#donationAmount").val();
    const confNum = $("#confirmationNumber").val();
    const year = moment().format("YYYY");
    const loggedInUser = localStorage.getItem("loggedInUser");
    // Reset the Form's Values
    $("#charityName").val("");
    $("#donationAmount").val("");
    $("#confirmationNumber").val("");
    // Create New Donation Object to Pass on
    const newDonationObject = {
      title: title,
      charity: charity,
      amount: amount,
      confNum: confNum,
      year: year,
      donor: loggedInUser
    };
    // Pass Donation Object to be Stored in the Database
    createMyDonation(newDonationObject);
  });

  // When User Clicks "CANCEL-BUTTON" on "DONATE FORM"
  $(".recent-crisis").on("click", ".cancel-donation-btn", e => {
    e.preventDefault();
    $("#charityName").val("");
    $("#donationAmount").val("");
    $("#confirmationNumber").val("");
    $(".donation-page").hide();
    populateRecentCrisis();
    $(".crisis-container").show();
  });

  //====== MY DONATIONS PAGE HANDLERS ======
  // When User Clicks "MY DONATIONS LINK"
  $("#donations").on("click", () => {
    // Hide Other Sections
    $(".recent-crisis").hide();
    $(".my-account").hide();
    $(".my-report").hide();
    // Show and Render User's Donations
    $(".my-donation").show();
    const loggedInUser = localStorage.getItem("loggedInUser");
    getMyDonation(loggedInUser);
  });

  // When User SEARCH for DONATIONS
  $(".my-donation").on("click", ".search-donation", e => {
    e.preventDefault();
    // Get the Value and Pass it to Search Function
    const loggedInUser = localStorage.getItem("loggedInUser");
    const query = $("#searchMyDonation").val();
    searchMyDonation(loggedInUser, query);
  });

  // When User Clicks "UPDATE-BUTTON" button on "MY DONATIONS"
  $(".my-donation").on("click", ".update-donation-btn", e => {
    // Get the ID from the Rendered Donation
    const id = $(e.currentTarget)
      .closest(".donation-card")
      .attr("donation-id");
    const title = $(e.currentTarget)
      .closest(".donation-card")
      .children(".donation-title")
      .text();
    const date = $(e.currentTarget)
      .closest(".donation-card")
      .children(".donation-date")
      .text();
    // Hide my-donation-container
    $(".my-donation-container").hide();
    // Show donation-update-page
    $(".donation-update-page").show();
    // Pass the ID to donation-update-page
    $("#IDUpdater").attr("donation-id", id);
    $("#titleUpdater").text(title);
    $("#dateUpdater").text(date);
  });

  // When User Clicks "DELETE-BUTTON" on "MY DONATIONS"
  $(".my-donation").on("click", ".delete-donation-btn", e => {
    // Get the ID from the donation-card
    const IDtoDelete = $(e.currentTarget)
      .closest(".donation-card")
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
    // Reset the Values on the Form
    $("#charityUpdate").val("");
    $("#amountUpdate").val("");
    $("#confNumUpdate").val("");
    // Create Update Object to Pass on
    const updateObject = {
      id: id,
      charity: charity,
      amount: amount,
      confNum: confNum
    };
    // Pass UpdateObject to Update the Donation
    updateMyDonation(updateObject);
  });

  // When User Clicks "CANCEL-BUTTON" on "DONATION UPDATE FORM"
  $(".my-donation").on("click", ".cancel-update-btn", e => {
    // Prevent Bubbling
    e.preventDefault();
    // Reset the Values on the Form
    $("#charityUpdate").val("");
    $("#amountUpdate").val("");
    $("#confNumUpdate").val("");
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
    $(".my-donation").hide();
    $(".my-report").hide();
    // Show and Render User's Account Info
    $(".my-account").show();
    const loggedInUser = localStorage.getItem("loggedInUser");
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
    const loggedInUser = localStorage.getItem("loggedInUser");
    // Reset Account Update Form
    $("#updateFirstName").val("");
    $("#updateLastName").val("");
    $("#updateEmail").val("");
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
    // Reset Account Update Form
    $("#updateFirstName").val("");
    $("#updateLastName").val("");
    $("#updateEmail").val("");
    // Show account-update-page
    $(".account-update-page").hide();
    // Hide my-account-container
    $(".my-account-container").show();
  });

  //====== MY REPORT PAGE HANDLERS ======
  // When User Clicks "MY REPORT LINK"
  $("#reports").on("click", () => {
    // Hide Other Sections
    $(".recent-crisis").hide();
    $(".my-donation").hide();
    $(".my-account").hide();
    // Show and Render User's Report
    $(".my-report").show();
    const loggedInUser = localStorage.getItem("loggedInUser");
    getMyAccount(loggedInUser);
  });
  // When User Clicks "SEARCH BUTTON" on "MY REPORT"
  $(".pull-report-btn").on("click", () => {
    // Get the Value and Pass it to Pull Report Function
    const reportYear = parseInt($("#reportYear").val(), 10);
    pullReport(reportYear);
  });

  //====== LOGOUT HANDLER ======
  $("#logout").on("click", () => {
    localStorage.removeItem("loggedInUser");
    $(".register-form").trigger("reset");
    $(".login-form").trigger("reset");
    $(".inside-collapsible").hide();
    $(".main-page").hide();
    $(".outside-collapsible").show();
    $(".landing-page").show();
  });
});
