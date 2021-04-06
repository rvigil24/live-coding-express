const express = require("express");
const router = express.Router();

//authentication routes
router.get("/login", (req, res, next) => {
  res.render("auth/login", { title: "login" });
});

router.get("/register", (req, res, next) => {
  res.render("auth/register", { title: "register" });
});

module.exports = router;
