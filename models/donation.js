"use strict";

const mongoose = require("mongoose");
const moment = require("moment");

const donationSchema = new mongoose.Schema({
  title: { type: String },
  date: { type: String },
  details: { type: String },
  donor: { type: String },
  created: { type: Date, default: moment().format("L") },
  donated: { type: Boolean, default: false }
});

donationSchema.methods.crisis = function() {
  return {
    id: this._id,
    title: this.title,
    date: this.date
  };
};

const Donation = mongoose.model("Donation", donationSchema);

module.exports = Donation;
