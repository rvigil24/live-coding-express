const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();

//mailer
const sendMail = require("../utils/email");

//contact page
router.get("/", (req, res, next) => {
  res.render("contact", { title: "Any suggestion?" });
});

//thank you page
router.post(
  "/",
  body("name", "name field is required").notEmpty(),
  body("email", "email field is required").isEmail(),
  body("message", "message is required").notEmpty(),
  (req, res, next) => {
    const { name, email, message } = req.body;
    console.log(message)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("contact", {
        title: "Any suggestion?",
        name,
        email,
        message,
        errors: errors.array(),
      });
    }
    sendMail({ name, email, message });
    return res.render("thanks", {
      title: "Thanks for contacting us!",
    });
  }
);

module.exports = router;
