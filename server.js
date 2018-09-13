"use strict";
// importing middlewares
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose").set("debug", true);
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

// user update details
app.put("/user/update/:username", (req, res) => {
  if (
    !(
      req.params.username &&
      req.body.username &&
      req.params.username === req.body.username
    )
  )
    res.status(400).json({ message: "username is not supplied" });
  let updateObject = {};
  let updateFields = ["firstname", "lastname", "email"];
  updateFields.forEach(field => {
    if (field in req.body) updateObject[field] = req.body[field];
  });
  User.findOneAndUpdate(
    { username: req.params.username },
    { $set: updateObject },
    { new: true }
  )
    .then(() => res.status(204).end())
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Account Update Error" });
    });
});

// CRISIS ENDPOINTS
// handle get all crisis from client (crisis-GET)
app.get("/crisis-all/:user", (req, res) => {
  Donation.find({ donor: req.params.user })
    .where("donated")
    .equals(false)
    .then(items => res.json(items.map(item => item.crisis())))
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Get All Crisis Error" });
    });
});

// handle crisis query term from client(crisis-QUERY)
app.get("/crisis/search/:user/:term", (req, res) => {
  Donation.find({
    $and: [
      { donor: req.params.user },
      { title: { $regex: req.params.term, $options: "i" } }
    ]
  })
    .where("donated")
    .equals(false)
    .then(items => res.json(items.map(item => item.crisis())))
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Get All Crisis Error" });
    });
});

// handle create crisis from client (crisis-POST)
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
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Crisis Creation Error" });
    });
});

// handle crisis deletion from client (crisis-DELETE)
app.delete("/crisis/delete/:id", function(req, res) {
  Donation.findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Crisis Deletion Error" });
    });
});

// DONATION ENDPOINTS
// handle donation get requests from client (donation-GET)
app.get("/donation-all/:user", (req, res) => {
  Donation.find({ donor: req.params.user })
    .where("donated")
    .equals(true)
    .then(items => res.json(items.map(item => item.donation())))
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Get All Donation Error" });
    });
});
// handle donation creation from client (donation-POST)
app.put("/donation/create/:id", (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id))
    res.status(400).json({ message: "parameter and body IDs must match" });
  let newObject = {};
  let newFields = ["charity", "amount", "confNum", "created", "donated"];
  newFields.forEach(field => {
    if (field in req.body) newObject[field] = req.body[field];
  });
  Donation.findByIdAndUpdate(req.params.id, { $set: newObject }, { new: true })
    .then(() => res.status(204).end())
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Donation Creation Error" });
    });
});

// handle donation update from client (donation-PUT)
app.put("/donation/update/:id", (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id))
    res.status(400).json({ message: "parameter and body IDs must match" });
  let newObject = {};
  let newFields = ["charity", "amount", "confNum", "created"];
  newFields.forEach(field => {
    if (field in req.body) newObject[field] = req.body[field];
  });
  Donation.findByIdAndUpdate(req.params.id, { $set: newObject }, { new: true })
    .then(() => res.status(204).end())
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Donation Update Error" });
    });
});

// handle donation query term from client(crisis-QUERY)
app.get("/donation/search/:user/:term", (req, res) => {
  Donation.find({
    $and: [
      { donor: req.params.user },
      { title: { $regex: req.params.term, $options: "i" } }
    ]
  })
    .where("donated")
    .equals(true)
    .then(items => res.json(items.map(item => item.donation())))
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Get All Crisis Error" });
    });
});

// handle donation deletion from client (donation-DELETE)
app.delete("/donation/delete/:id", (req, res) => {
  Donation.findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Donation Deletion Error" });
    });
});

// DONATION REPORT ENDPOINT
app.get("/report/:user", (req, res) => {
  const reportYear = parseInt(req.params.year);
  Donation.aggregate([
    { $match: { donor: req.params.user, donated: true } },
    {
      $group: {
        _id: { year: { $year: "$created" }, month: { $month: "$created" } },
        total: { $sum: "$amount" },
        count: { $sum: 1 }
      }
    }
  ])
    .then(item => res.json(item))
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Report Generation Error" });
    });
});

// catch all endpoint
app.use("*", (req, res) => {
  res.status(404).json({ message: "Page Not Found" });
});

module.exports = { app, runServer, closeServer };
