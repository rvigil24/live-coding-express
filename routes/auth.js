const express = require("express");
const router = express.Router();

//authentication routes
router.get("/login", (req, res, next) => {
  res.render("auth/login", { title: "Login" });
});

router.get("/register", (req, res, next) => {
  res.render("auth/register", { title: "Register" });
});

module.exports = router;
