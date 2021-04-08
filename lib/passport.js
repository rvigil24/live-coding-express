const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/User");
const config = require("../config");
const { ErrorHandler, errorRedirect } = require("../lib/errors");

module.exports = function () {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passReqToCallback: true,
      },
      (req, username, password, done) => {
        const { res, next } = req;

        User.findOne({ email: username }, (err, user) => {
          //authentication errors
          if (err)
            return next(
              new ErrorHandler({
                route: "auth/login",
                title: "Login",
                messages: ["Internal Server Error"],
              })
            );
          if (!user)
            return next(
              new ErrorHandler({
                route: "auth/login",
                title: "Login",
                messages: ["User not found"],
              })
            );
          if (!user.validPassword(password))
            return next(
              new ErrorHandler({
                route: "auth/login",
                title: "Login",
                messages: ["Email or password not valid"],
              })
            );
          if (user.facebookId)
            return next(
              new ErrorHandler({
                route: "auth/login",
                title: "Login",
                messages: ["Account already registered with Facebook"],
              })
            );

          //user authenticated successfully
          return done(null, user);
        });
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
            return next(
              new ErrorHandler({
                route: "auth/login",
                title: "Login",
                messages: ["Error connecting with Facebook"],
              })
            );
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
                      if (err)
                        return next(
                          new ErrorHandler({
                            route: "auth/register",
                            title: "Register",
                            messages: [
                              "Error updating user, please try again later",
                            ],
                          })
                        );
                      return res.redirect("/");
                    });
                  })
                  .catch((err) => {
                    return next(
                      new ErrorHandler({
                        route: "auth/register",
                        title: "Register",
                        messages: [err.message],
                      })
                    );
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
                      return next(
                        new ErrorHandler({
                          route: "auth/register",
                          title: "Register",
                          messages: [
                            "Error creating user, please try again later",
                          ],
                        })
                      );
                    return res.redirect("/");
                  });
                })
                .catch((err) => {
                  return next(
                    new ErrorHandler({
                      route: "auth/register",
                      title: "Register",
                      messages: [err.message],
                    })
                  );
                });
            });
          }

          //if we found the facebook profile id
          return done(null, user);
        });
      } catch (ex) {
        return next(
          new ErrorHandler({
            route: "auth/register",
            title: "Register",
            messages: ["Login error"],
          })
        );
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
