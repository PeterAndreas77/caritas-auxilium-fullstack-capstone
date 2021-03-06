"use strict";

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: { type: String },
  password: { type: String },
  firstname: { type: String },
  lastname: { type: String },
  email: { type: String }
});

userSchema.methods.validatePassword = function(password, callback) {
  bcrypt.compare(password, this.password, (err, isValid) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null, isValid);
  });
};

userSchema.methods.detailed = function() {
  return {
    firstname: this.firstname,
    lastname: this.lastname,
    username: this.username,
    email: this.email
  };
};

const User = mongoose.model("User", userSchema);

module.exports = User;
