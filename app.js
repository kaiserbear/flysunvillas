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


passport.use(new LocalStrategy(function(username, password, done) {
  User.findOne({ username: username }, function(err, user) {
    if (err) return done(err);
    if (!user) {
      return done(null, false, { message: 'Sorry, we don\'t recognise that email address' });
    }
    user.comparePassword(password, function(err, isMatch) {
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Sorry, that password is incorrect.' });
      }
    });
  });
}));


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
var properties = require("./routes/prop");

app.use("/", indexRoutes);
app.use("/properties/", properties);



// Error Handling
app.get('*', wrapAsync(async function(req, res) {
  await new Promise(resolve => setTimeout(() => resolve(), 50));
  // Async error!
  throw new Error('Sorry, this page can\'t be found.');
}));

app.use(function(error, req, res, next) {
  // Gets called because of `wrapAsync()`
  // res.json({ message: error.message });
  res.render("error",{
      message: error.message,
      admin: false,
      user: ''
  });
});

function wrapAsync(fn) {
  return function(req, res, next) {
    // Make sure to `.catch()` any errors and pass them along to the `next()`
    // middleware in the chain, in this case the error handler.
    fn(req, res, next).catch(next);
  };
}

app.listen(port, ip, function() {
    console.log("FlySunVillas Server Has Started!");
});