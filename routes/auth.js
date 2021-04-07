const express = require("express");
const router = express.Router();
const passport = require("passport");
const { body } = require("express-validator");

const {
  getLoginPage,
  getRegisterPage,
  loginUser,
  logOutUser,
  registerUser,
} = require("../controllers/auth/auth.controller");

//authentication routes
router
  .route("/login")
  .get(getLoginPage)
  .post(
    body("email", "email field is required").isEmail(),
    body("password", "password field is required").notEmpty(),
    loginUser,
    passport.authenticate("local", { passReqToCallback: true }),
    (req, res, next) => {
      res.redirect("/");
    }
  );

router.get("/logout", logOutUser);

router
  .route("/register")
  .get(getRegisterPage)
  .post(
    body("name", "name field is required").notEmpty().trim().escape(),
    body("email", "email field is required").isEmail(),
    body("password", "password length must be at least 7 characters")
      .isLength({
        min: 7,
        max: 25,
      })
      .custom((value, { req, loc, path }) => {
        if (value !== req.body.confirm_password) {
          throw new Error("Passwords don't match");
        } else {
          return value;
        }
      })
      .withMessage("Passwords don't match"),
    registerUser
  );

router.get("/facebook", passport.authenticate("facebook", { scope: "email" }));
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
  })
);
module.exports = router;
