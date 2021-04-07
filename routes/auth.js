const express = require("express");
const router = express.Router();
const {
  getLoginPage,
  getRegisterPage,
  loginUser,
  registerUser,
} = require("../controllers/auth/auth.controller");

//authentication routes
router.get("/login", getLoginPage);

router.get("/register", getRegisterPage);

module.exports = router;
