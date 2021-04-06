const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();

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
    const errors = validationResult(req);
    return !errors.isEmpty()
      ? res.render("contact", {
          title: "Any suggestion?",
          name,
          email,
          message,
          errors: errors.array(),
        })
      : res.render("thanks", {
          title: "Thanks for contacting us!",
        });
  }
);

module.exports = router;
