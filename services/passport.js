const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const keys = require("../config/keys");

const User = mongoose.model("users");

//creating token for user
passport.serializeUser((user, done) => {
  done(null, user.id); //user.id automatically references unique id in mongodb
});

//turning id into a mongoose model instance
passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback" //route the user will be sent after they grant permissions to out applications (redirect URI)
    }, 
    //callback function that gets called once the user is redirected back to our application from the OAuth flow.
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleID: profile.id }).then(existingUser => {
        if (existingUser) {
          done(null, existingUser);
        } else {
          new User({ googleID: profile.id })
            .save()
            .then(user => done(null, user));
        }
      });
    }
  )
);
