"use strict";

const mongoose = require("mongoose");
const faker = require("faker");
const chai = require("chai");
const chaiHttp = require("chai-http");

const { app, runServer, closeServer } = require("../server");
const Donation = require("../models/donation");
const { TEST_DATABASE_URL } = require("../config");

chai.use(chaiHttp);
const should = chai.should();

function seedTestDB() {
  console.info("seeding donation database with test data");
  const seedData = [];
  for (let x = 1; x <= 10; x++) {
    seedData.push({
      donor: "jojo",
      title: faker.name.title(),
      charity: faker.name.firstName(),
      year: faker.random.number(),
      amount: faker.random.number(),
      confNum: faker.lorem.word()
    });
  }
  return Donation.insertMany(seedData);
}

function dropTestDB() {
  console.warn("Dropping test database");
  return mongoose.connection.dropDatabase();
}

describe("Donation API tests", function() {
  // run server before running tests
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });
  // seed database with fake data before each test
  beforeEach(function() {
    return seedTestDB();
  });
  // drop fake database after each test
  afterEach(function() {
    return dropTestDB();
  });
  // close server after running tests
  after(function() {
    return closeServer();
  });

  describe("GET endpoint", function() {
    it("should return all donations with GET", function() {
      let res;
      let donor = "jojo";
      return chai
        .request(app)
        .get(`/donation-all/${donor}`)
        .then(function(_res) {
          res = _res;
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("array");
          return Donation.countDocuments();
        })
        .then(function(count) {
          res.body.should.have.lengthOf(count);
        });
    });
  });

  describe("POST endpoint", function() {
    it("should POST a new donation", function() {
      const newDonation = {
        donor: "jojo",
        title: faker.name.title(),
        charity: faker.name.firstName(),
        year: faker.random.number(),
        amount: faker.random.number(),
        confNum: faker.lorem.word()
      };

      return chai
        .request(app)
        .post("/donation/create")
        .send(newDonation)
        .then(function(res) {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.id.should.not.be.null;
          res.body.title.should.equal(newDonation.title);
          res.body.charity.should.equal(newDonation.charity);
          res.body.amount.should.equal(newDonation.amount);
          res.body.confNum.should.equal(newDonation.confNum);
          return Donation.findById(res.body.id);
        })
        .then(function(donation) {
          donation.title.should.equal(newDonation.title);
          donation.charity.should.equal(newDonation.charity);
          donation.year.should.equal(newDonation.year);
          donation.amount.should.equal(newDonation.amount);
          donation.confNum.should.equal(newDonation.confNum);
        });
    });

    describe("PUT endpoint", function() {
      it("should PUT a donation by ID", function() {
        const updDonation = {
          title: faker.name.title(),
          charity: faker.name.firstName(),
          amount: faker.random.number(),
          confNum: faker.lorem.word()
        };

        return Donation.findOne()
          .then(function(donation) {
            updDonation.id = donation.id;
            return chai
              .request(app)
              .put(`/donation/update/${updDonation.id}`)
              .send(updDonation);
          })
          .then(function(res) {
            res.should.have.status(204);
            return Donation.findById(updDonation.id);
          })
          .then(function(donation) {
            donation.title.should.equal(updDonation.title);
            donation.charity.should.equal(updDonation.charity);
            donation.amount.should.equal(updDonation.amount);
            donation.confNum.should.equal(updDonation.confNum);
          });
      });
    });

    describe("DELETE endpoint", function() {
      it("should DELETE a donation by ID", function() {
        let delDonation;
        return Donation.findOne()
          .then(function(donation) {
            delDonation = donation;
            return chai
              .request(app)
              .delete(`/donation/delete/${delDonation.id}`);
          })
          .then(function(response) {
            response.should.have.status(204);
            return Donation.findById(delDonation.id);
          })
          .then(function(donation) {
            should.not.exist(donation);
          });
      });
    });
  });
});
