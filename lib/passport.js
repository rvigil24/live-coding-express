const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");
const { errorHandler } = require("./errors");

module.exports = function () {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passReqToCallback: true,
      },
      (req, username, password, done) => {
        const { res } = req;
        User.findOne({ email: username }, (err, user) => {
          if (err)
            return res.render("auth/login", {
              title: "Login",
              errors: [{ msg: err }],
            });
          if (!user) {
            return res.render("auth/login", {
              title: "Login",
              errors: [{ msg: "Incorrect username or password" }],
            });
          }
          if (!user.validPassword(password)) {
            return res.render("auth/login", {
              title: "Login",
              errors: [{ msg: "Incorrect username or password" }],
            });
          }
          return done(null, user);
        });
      }
    )
  );
};

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findOne({ _id: id }, (err, user) => {
    done(err, user);
  });
});
