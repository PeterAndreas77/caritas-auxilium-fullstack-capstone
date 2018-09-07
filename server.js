"use strict";
// importing middlewares
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");

// importing modules
const config = require("./config");
const User = require("./models/user");
const Donation = require("./models/donation");

// using middlewares
const app = express();
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(cors());

// setting global promise as mongoose promise
mongoose.Promise = global.Promise;

let server = undefined;

// RUN SERVER
function runServer(url) {
  return new Promise((resolve, reject) => {
    mongoose.connect(
      url,
      err => {
        if (err) reject(err);
        server = app
          .listen(config.PORT, () => {
            console.log(`Your Server is Listening on localhost:${config.PORT}`);
            resolve();
          })
          .on("error", err => {
            mongoose.disconnect();
            reject(err);
          });
      }
    );
  });
}

// CLOSE SERVER
function closeServer() {
  return mongoose.disconnect().then(
    () =>
      new Promise((resolve, reject) => {
        console.log("Closing Server");
        server.close(err => {
          if (err) reject(err);
          resolve();
        });
      })
  );
}

// if other modules try to run the server
if (require.main === module) {
  runServer(config.DATABASE_URL).catch(err => console.log(err));
}

// USER ENDPOINTS
// creating new users
app.post("/users/register", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let firstname = req.body.firstname;
  let lastname = req.body.lastname;
  let email = req.body.email;

  username = username.trim();
  password = password.trim();
  firstname = firstname.trim();
  lastname = lastname.trim();
  email = email.trim();

  bcrypt.genSalt(10, (err, salt) => {
    if (err) res.status(500).json({ message: "Salt Generation Error" });
    bcrypt.hash(password, salt, (err, hash) => {
      if (err)
        res.status(500).json({ message: "Password and Salt Hash Error" });
      User.create(
        { username, firstname, lastname, email, password: hash },
        (err, userItem) => {
          if (err) res.status(500).json({ message: "User Creation Error" });
          if (userItem) {
            console.log(`User ${username} created.`);
            return res.json(userItem);
          }
        }
      );
    });
  });
});

// logging users in
app.post("/users/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ username: username }, (err, userItem) => {
    if (err) res.status(500).json({ message: "Database Connection Error" });
    if (!userItem) res.status(500).json({ message: "User Not Found" });
    else {
      userItem.validatePassword(password, (err, isValid) => {
        if (err)
          console.log("Database Connection Error on Password Validation");
        if (!isValid) res.status(401).json({ message: "Password is Invalid" });
        else {
          console.log(`User ${username} logged in.`);
          return res.json(userItem);
        }
      });
    }
  });
});

// user account details
app.get("/user/:user", (req, res) => {
  User.findOne({ username: req.params.user })
    .then(user => {
      console.log(user);
      return res.json(user.detailed());
    })
    .catch(err => {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Cannot retrieve user from database" });
    });
});

// CRISIS ENDPOINTS
app.post("/crisis/create", (req, res) => {
  const requiredFields = ["title", "date", "details"];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body))
      res.status(400).send(`Missing ${field} in request body`);
  }
  Donation.create({
    title: req.body.title,
    date: req.body.date,
    details: req.body.details,
    donor: req.body.donor
  })
    .then(item => res.status(201).json(item.crisis()))
    .catch(() => res.status(500).json({ message: "Crisis Creation Error" }));
});

// catch all endpoint
app.use("*", (req, res) => {
  res.status(404).json({ message: "Page Not Found" });
});

module.exports = { app, runServer, closeServer };
