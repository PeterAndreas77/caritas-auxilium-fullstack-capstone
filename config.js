"use strict";
exports.DATABASE_URL =
  process.env.DATABASE_URL ||
  global.DATABASE_URL ||
  "mongodb://admin:admin123@ds147592.mlab.com:47592/caritas-auxilium";
exports.TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL ||
  "mongodb://testadmin:test123@ds147592.mlab.com:47592/caritas-auxilium-test";
exports.PORT = process.env.PORT || 3000;
