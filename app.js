var express = require("express");
var mongoose = require("mongoose");
var passport = require("passport");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var bodyParser = require("body-parser");
var moment = require("moment");
var methodOverride = require("method-override");
var ObjectId = require('mongodb').ObjectID;
var keys = require("./config/keys");

//Passport config
require("./config/passport")(passport);

//Load models
require("./models/User");
require("./models/Story");

//Load all the routes
var auth = require("./routes/auth");
var index = require("./routes/index");
var stories = require("./routes/stories");

//Map global promises
mongoose.Promise = global.Promise;

//Mongoose config
//the connect method returns a promise that can be handled using then and catch
//then executes when the promise is successful
//The connect() function also accepts a callback parameter and returns a promise.
mongoose.connect(keys.mongoURI)
  .then(function() {
    console.log("mongodb connected");
  })
  .catch(err => console.log(err));

var app = express();
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json())
app.use(cookieParser());
app.use(session({
  secret: "Random",
  resave: false,
  saveUninitialized: false
}));
app.use(methodOverride("_method"));

//Set Static folder
app.use(express.static("public"))

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Set global variables so that it can be used in ALL the FILES
//Here setting the user variable global
app.use(function(req, res, next){
  res.locals.user = req.user || null;
  next();
});
//Making moment a public variable
app.locals.moment = moment;

//Use the routes
app.use("/", index);
app.use("/auth", auth);
app.use("/stories", stories);

var port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log("App started on port " + port);
});
