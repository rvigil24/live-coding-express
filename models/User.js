const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const crypto = require("crypto");
const { buildSanitizeFunction } = require("express-validator");
const { ErrorHandler } = require("../lib/errors");

//define schema and attributes
const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  hash: String,
  salt: String,
  facebookId: String,
});

//define methods
userSchema.methods.setPassword = function (password) {
  try {
    this.salt = crypto.randomBytes(16).toString("hex");
    this.hash = crypto
      .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
      .toString("hex");
  } catch (ex) {
    console.log(ex);
  }
};

userSchema.methods.validPassword = function (password) {
  try {
    const hash = crypto
      .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
      .toString("hex");
    return this.hash === hash;
  } catch (ex) {
    console.log(ex);
  }
};

module.exports = mongoose.model("User", userSchema);
