var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var middle = require("../middleware/auth");

//Load Story model
require("../models/User");
require("../models/Story");
var Story = mongoose.model("stories");
var User = mongoose.model("users");

router.get("/", middle.ensureGuest, function(req, res) {
  res.render("index/welcome");
});

router.get("/dashboard", middle.ensureAuthenticated, function(req, res) {
  Story.find({user: req.user._id}, function(err, stories){
    if(err){
      console.log(err);
    }else{
      res.render("index/dashboard", {stories: stories});
    }
  }).populate("user");
});

router.get("/about", function(req, res){
  res.render("index/about");
});

module.exports = router;
