const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/User");
const config = require("../config");
const { errorHandler } = require("../lib/errors");

module.exports = function () {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passReqToCallback: true,
      },
      (req, username, password, done) => {
        try {
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
            if (user.facebookId) {
              return res.render("auth/login", {
                title: "Login",
                errors: [{ msg: "Log in with your Facebook Account" }],
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
        } catch (ex) {
          return res.render("auth/login", {
            title: "Login",
            errors: [errorHandler(err)],
          });
        }
      }
    )
  );
};

passport.use(
  new FacebookStrategy(
    {
      clientID: config.facebook.id,
      clientSecret: config.facebook.secret,
      callbackURL: "http://localhost:3000/auth/facebook/callback",
      profileFields: ["id", "emails", "name"],
      passReqToCallback: true,
    },
    (req, accessToken, refreshToken, profile, done) => {
      const { res } = req;
      try {
        User.findOne({ facebookId: profile.id }, (err, user) => {
          if (err) {
            return res.render("auth/register", {
              title: "Register",
              email,
              errors: [errorHandler(err)],
            });
          }

          //if the user hasn't login previously using facebook
          if (!user) {
            User.findOne({ email: profile.emails[0].value }, (err, user) => {
              //if the user has an email already registered
              if (user) {
                user.facebookId = profile.id;
                return user
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
                      email,
                      errors: [errorHandler(err)],
                    });
                  });
              }

              //if there is not account created, we create an account
              const newUser = new User();
              newUser.email = profile.emails[0].value;
              newUser.name = `${profile.name.givenName} ${profile.name.familyName}`;
              newUser.facebookId = profile.id;
              newUser
                .save()
                .then((data) => {
                  return req.login(user, (err) => {
                    if (err)
                      return res.render("auth/login", {
                        title: "Login",
                        errors: [errorHandler(err)],
                      });
                    return res.redirect("/");
                  });
                })
                .catch((err) => {
                  return res.render("auth/register", {
                    title: "Register",
                    errors: [errorHandler(err)],
                  });
                });
            });
          }

          //if we found the facebook profile id
          return done(null, user);
        });
      } catch (ex) {
        return res.render("auth/register", {
          title: "Register",
          errors: [errorHandler(err)],
        });
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findOne({ _id: id }, (err, user) => {
    done(err, user);
  });
});
