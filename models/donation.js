"use strict";

const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
  title: { type: String },
  donor: { type: String },
  charity: { type: String },
  amount: { type: Number },
  confNum: { type: String },
  created: { type: String },
  year: { type: Number }
});

donationSchema.methods.donated = function() {
  return {
    id: this._id,
    title: this.title,
    charity: this.charity,
    amount: this.amount,
    confNum: this.confNum,
    created: this.created
  };
};

const Donation = mongoose.model("Donation", donationSchema);

module.exports = Donation;
