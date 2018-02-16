var express = require("express");
var router = express.Router();
var passport = require("passport");

//here scope defines all the information required from the user
router.get("/google", passport.authenticate("google", {
  scope: ["profile", "email"]
}));

router.get('/google/callback',
  passport.authenticate('google', {
    successRedirect: '/dashboard',
    failureRedirect: '/'
  }));

router.get("/verify", function(req, res){
  //if youre authenticated then req.user is available
  if(req.user){
    console.log(req.user);
  }else{
    console.log("not authenticated");
  }
});

router.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});

module.exports = router;
