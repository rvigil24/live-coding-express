const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("contact", { title: "Any suggestion?" });
});

router.post("/", (req, res, next) => {
  res.render("thanks", {
    title:
      "Thanks for contacting us, we'll get in touch really soon! Any feedback is greatly appreciated!",
  });
});

module.exports = router;
