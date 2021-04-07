const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const contactController = require("../controllers/pages/contact.controller");

//contact page
router.get("/", contactController.index);

//thank you page
router.post(
  "/",
  body("name", "name field is required").notEmpty(),
  body("email", "email field is required").isEmail(),
  body("message", "message is required").notEmpty(),
  contactController.thankYou
);

module.exports = router;
