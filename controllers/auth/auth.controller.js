const { validationResult } = require("express-validator");
const User = require("../../models/User");
const { ErrorHandler } = require("../../lib/errors");

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
    const messageArray = errors.array().map((err) => err.msg);
    return next(
      new ErrorHandler({
        title: "Register",
        route: "auth/login",
        messages: messageArray,
        data: {
          email,
        },
      })
    );
  }
  next();
};

const registerUser = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messageArray = errors.array().map((err) => err.msg);
    return next(
      new ErrorHandler({
        title: "Register",
        route: "auth/register",
        messages: messageArray,
        data: {
          name,
          email,
          password,
        },
      })
    );
  }
  const user = new User();
  user.name = name;
  user.email = email;
  user.setPassword(password);
  user
    .save()
    .then((data) => {
      return req.login(user, (err) => {
        if (err)
          return next(
            new ErrorHandler({
              title: "Register",
              code: 10000,
              route: "auth/register",
              messages: ["User could not be created, please try again later"],
              data: {
                name,
                email,
                password,
              },
            })
          );
        return res.redirect("/");
      });
    })
    .catch((err) => {
      return next(
        new ErrorHandler({
          title: "Register",
          messages: [err.message],
          route: "auth/register",
          data: {
            name,
            email,
            password,
          },
        })
      );
    });
};

module.exports = {
  getLoginPage,
  getRegisterPage,
  loginUser,
  logOutUser,
  registerUser,
};
