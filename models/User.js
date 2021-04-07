const mongoose,
  { Schema } = require("mongoose");
const crypto = require("crypto");

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
});

//define methods
userSchema.methods.setPassword = (password) => {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, "sha1");
};

userSchema.methods.validPassword = (password) => {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, "sha1")
    .toString("hex");
  return this.hash === hash;
};

module.exports = mongoose.model("User", userSchema);
