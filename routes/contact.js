const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const { index, thankYou } = require("../controllers/pages/contact.controller");

//contact page
router.get("/", index);

//thank you page
router.post(
  "/",
  body("name", "name field is required")
    .isLength({ min: 5, max: 50 })
    .trim()
    .escape(),
  body("email", "email field is required").isEmail().normalizeEmail(),
  body("message", "message is required")
    .isLength({ min: 5, max: 1000 })
    .trim()
    .escape(),
  thankYou
);

module.exports = router;
