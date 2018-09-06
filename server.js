"use strict";
// importing middlewares
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
// importing modules
const config = require("./config");

// using middlewares
const app = express();
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(cors());
// setting global promise as mongoose promise
mongoose.Promise = global.Promise;

// RUN & CLOSE SERVER
let server = undefined;

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

if (require.main === module) {
  runServer(config.DATABASE_URL).catch(err => console.log(err));
}

// catch all endpoint
app.use("*", (req, res) => {
  res.status(404).json({ message: "Page Not Found" });
});

module.exports = { app, runServer, closeServer };
