var googleStrategy = require("passport-google-oauth2").Strategy;
var mongoose = require("mongoose");
var keys = require("./keys");

//Load user models
require("../models/User");
var User = mongoose.model("users");

//the parameters required are taken from the keys file
//callbackURL specifies where to redirect after the user selects an account and where google sends responses to authentcation requests
module.exports = function(passport) {
  passport.use(
    new googleStrategy({
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback",
      proxy: true
    }, function(accessToken, refreshToken, profile, done) {
      var newUser = {
        googleID: profile.id,
        email: profile.emails[0].value,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        image: profile.photos[0].value.substring(0, profile.photos[0].value.length - 6)
      }
      User.findOne({
        googleID: profile.id
      }).then(user => {
        if (user) {
          //Return User
          done(null, user);
        } else {
          //Create User
          new User(newUser)
            .save()
            .then(user => done(null, user));
        }
      })
    })
  )

  passport.serializeUser(function(user, done){
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done){
    User.findById(id).then(user => done(null, user))
  });
}
