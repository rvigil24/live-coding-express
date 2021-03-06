const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const hbs = require("hbs");
const passport = require("passport");
const flash = require("connect-flash");

//import mongoose and configuration
const mongoose = require("mongoose");
require("dotenv").config();
const { handleError } = require("./lib/errors");

//import session
const session = require("express-session");

//import our routes
const authRouter = require("./routes/auth");
const indexRouter = require("./routes/index");
const contactRouter = require("./routes/contact");
const taskRouter = require("./routes/task");

//lets connect mongoose
mongoose.connect(process.env.DB_CONNECTION);
const app = express();

// view engine setup, we are using handlebars this time
app.set("views", path.join(__dirname, "views/pages"));
app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partials");
hbs.registerHelper("section", function (name, options) {
  if (!this._sections) this._sections = {};
  this._sections[name] = options.fn(this);
  return null;
});
hbs.registerHelper("isActiveLink", (val1, val2) => {
  return val1 === val2;
});

//our middlewares
app.use(flash());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(express.static(path.join(__dirname, "public")));
app.use(passport.initialize());
app.use(passport.session());
require("./lib/passport")(passport);

app.use((req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
});

//our routes go here
app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/contact", contactRouter);
app.use("/task", taskRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

//middleware for error handling
app.use((err, req, res, next) => {
  handleError(err, res);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
