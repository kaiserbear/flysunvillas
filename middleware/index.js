var Properties = require("../models/properties");

// all the middleare goes here
var middlewareObj = {};

middlewareObj.checkOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Properties.findById(req.params.id, function(err, foundItem){
           if(err){
               req.flash("error", "Property not found");
               res.redirect("back");
           }  else {
            if(foundItem.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

middlewareObj.checkCountrySelection = function(req, res, next) {
    res.locals.country = req._parsedOriginalUrl.pathname.slice(1);
    return next();
}

module.exports = middlewareObj;