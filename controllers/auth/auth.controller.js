const { validationResult } = require("express-validator");
const User = require("../../models/User");
const { errorHandler } = require("../../lib/errors");

const getLoginPage = (req, res, next) => {
  res.render("auth/login", { title: "Login" });
};

const getRegisterPage = (req, res, next) => {
  res.render("auth/register", { title: "Register" });
};

const logOutUser = (req, res, next) => {
  req.logout();
  res.redirect("/");
};

const loginUser = (req, res, next) => {
  const { email } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("auth/login", {
      title: "Login",
      email,
      errors: errors.array(),
    });
  }
  next();
};

const registerUser = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("auth/register", {
      title: "Register",
      name,
      email,
      errors: errors.array(),
    });
  }
  const user = new User();
  user.name = name;
  user.email = email;
  user.setPassword(password);
  user
    .save()
    .then((data) => {
      return req.login(user, (err) => {
        if (err) return next(err);
        return res.redirect("/");
      });
    })
    .catch((err) => {
      return res.render("auth/register", {
        title: "Register",
        name,
        email,
        errors: [errorHandler(err)],
      });
    });
};

module.exports = {
  getLoginPage,
  getRegisterPage,
  loginUser,
  logOutUser,
  registerUser,
};
