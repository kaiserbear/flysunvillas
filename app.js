const express = require("express"),
      app = express(),
      bodyParser = require("body-parser"),
      methodOverride = require("method-override"),
      mongoose = require("mongoose"),
      flash = require("connect-flash"),
      passport = require("passport"),
      LocalStrategy = require("passport-local"),
      sass = require('node-sass'),
      dotenv = require('dotenv').config(),
      property = require("./models/properties"),
      User = require("./models/user"),
      url = process.env.DATABASEURL,
      port = process.env.PORT,
      ip = process.env.IP;


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


passport.use('local', new LocalStrategy(User.authenticate()));

mongoose.Promise = global.Promise;
mongoose.connect(url, {
     useMongoClient: true
});

app.use(bodyParser.urlencoded({
    extended: true
}));


app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

var indexRoutes = require("./routes/index");
var properties = require("./routes/admin");

app.use("/", indexRoutes);
app.use("/admin/", properties);


app.listen(port, ip, function() {
    console.log("FlySunVillas Server Has Started!");
});