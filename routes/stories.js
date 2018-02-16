var express = require("express");
var router = express.Router();
var middle = require("../middleware/auth");
var mongoose = require("mongoose");
var ObjectId = require('mongodb').ObjectID;

//Load Story model
require("../models/User");
require("../models/Story");
var Story = mongoose.model("stories");
var User = mongoose.model("users");

//stories index page
//.populate will populate the given field from the model
router.get("/", function(req, res) {
  Story.find({status: "public"}, function(err, stories){
    if(err){
      console.log(err);
    }else{
      res.render("stories/index", {stories: stories});
    }
  }).populate("user")
    .sort({date: 'desc'});
});

//Add a story Page
router.get("/new", middle.ensureAuthenticated, function(req, res) {
  res.render("stories/new");
});

//Post a Story
router.post("/", function(req, res) {
  var allowComments;
  if (req.body.comments) {
    allowComments = true;
  } else {
    allowComments = false;
  }
  var storyObj = {
    title: req.body.title,
    body: req.body.body,
    status: req.body.status,
    allowComments: allowComments,
    user: req.user._id
  }

  new Story(storyObj)
    .save()
    .then(story => {
      res.redirect("/stories/show/" + story._id);
    })
});

//Show a Story Page
router.get("/show/:id", function(req, res){
  Story.findOne({_id: req.params.id}, function(err, story){
    if(err){
      console.log(err);
    }else{
      if(story.status == "public"){
        res.render("stories/show", {story: story});
      }else{
        if(req.user){
          if(req.user.id == story.user._id){
            res.render("stories/show", {story: story});
          }else{
            res.redirect("/stories");
          }
        }else{
          res.redirect("/stories");
        }
      }
    }
  }).populate("user").populate("comments.commentUser")

})

//Edit a story page
router.get("/edit/:id", middle.ensureAuthenticated, function(req, res) {
  Story.findOne({_id: req.params.id}, function(err, story){
    if(err){
      console.log(err);
    }else{
      //TO ensure that no other user can edit anyone elses post
      if(story.user.equals(req.user)){
        res.redirect("/stories");
      }else{
        res.render("stories/edit", {story: story});
      }
    }
  })
});

//Update a story
router.put("/:id", function(req, res){
  var allowComments;
  if (req.body.comments) {
    allowComments = true;
  } else {
    allowComments = false;
  }
    var storyObj = {
      title: req.body.title,
      body: req.body.body,
      status: req.body.status,
      allowComments: allowComments,
      user: req.user._id
    }
  Story.findByIdAndUpdate(req.params.id, storyObj, function(err, storyUpdated){
    if(err){
      console.log(err);
    }else{
      res.redirect("/dashboard");
    }
  });
});

//My Story page
router.get("/my", middle.ensureAuthenticated, function(req, res){
  Story.find({user: req.user._id}, function(err, stories){
    if(err){
      console.log(err);
    }else{
      res.render("stories/index", {stories: stories});
    }
  }).populate("user")
})

//List Stories of a particular users
router.get("/user/:id", function(req, res){
  Story.find({status: "public", user: req.params.id}, function(err, stories){
    if(err){
      console.log(err);
    }else{
      res.render("stories/index", {stories: stories});
    }
  }).populate("user");
});

//Delete A Story
router.delete("/:id", function(req, res){
  Story.findByIdAndRemove(req.params.id, function(err){
    if(err){
      console.log(err);
    }else{
      res.redirect("/dashboard");
    }
  })
});

//Add a comments
router.post("/comment/:id", function(req, res){
  Story.findOne({_id: req.params.id})
  .then(story => {
    var newComment = {
      commentBody: req.body.commentBody,
      commentUser: req.user
    }
    story.comments.unshift(newComment);
    story.save()
    .then(story => {
      console.log(story);
      res.redirect("/stories/show/" + story._id);
    })
  })
});

module.exports = router;
