const express = require("express");
const router  = express.Router();
const user = require("../models/user");
const property = require("../models/properties");
const middleware = require("../middleware");
const passport = require("passport");

function getAllPropertys(string, res) {
    property.find({}, function(err, allpropertys){
       if(err){
           console.log(err);
       } else {
          res.render(string,{
            propertys:allpropertys
          });
       }
    });
}

router.get("/", function(req, res){
  res.redirect(req.baseUrl + '/en/');
});

router.get("/en/", middleware.checkCountrySelection, function(req, res){
  getAllPropertys(res.locals.country + "index", res);
});

router.get("/fr/", middleware.checkCountrySelection, function(req, res){
  getAllPropertys(res.locals.country + "index", res);
});

router.get("/es/", middleware.checkCountrySelection, function(req, res){
  getAllPropertys(res.locals.country + "index", res);
});

router.get("/ru/", middleware.checkCountrySelection, function(req, res){
  getAllPropertys(res.locals.country + "index", res);
});

router.get("/gr/", middleware.checkCountrySelection, function(req, res){
  getAllPropertys(res.locals.country + "index", res);
});

router.get("/en/properties/", middleware.checkCountrySelection, function(req, res){
  getAllPropertys(res.locals.country + "index", res);
});

router.get("/fr/proprietes/", middleware.checkCountrySelection, function(req, res){
  getAllPropertys(res.locals.country + "index", res);
});

router.get("/es/propiedades/", middleware.checkCountrySelection, function(req, res){
  getAllPropertys(res.locals.country + "index", res);
});

router.get("/ru/properties/", middleware.checkCountrySelection, function(req, res){
  getAllPropertys(res.locals.country + "index", res);
});

router.get("/gr/properties/", middleware.checkCountrySelection, function(req, res){
  getAllPropertys(res.locals.country + "index", res);
});

router.get("/register", function(req, res){
   res.render("register", res);
});


router.post("/register", function(req, res){
    var newUser = new user({ username: req.body.username });
    user.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome to Fly Sun Villas" + user.username);
           res.redirect("/");
        });
    });
});

router.get("/login", function(req, res){
    res.render("login", { user: req.user });
});

//handling login logic
router.post("/login", passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login"
    }), function(req, res) {
    req.flash("success", "Hey there!");
  });



// logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged you out!");
   res.redirect("/");
});

module.exports = router;