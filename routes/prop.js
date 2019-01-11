const express = require("express");
const app = express();
const aws = require('aws-sdk');
const router = express.Router();
const property = require("../models/properties");
const middleware = require("../middleware");
const passport = require("passport");
const user = require("../models/user");
const pjson = require('../package.json');

var slugify = require("slugify");

const googleapi = process.env.GOOGLEAPI;

//INDEX - show all jobs
router.get("/", function(req, res) {
    property.find({}, function(err, items) {
        if (err) {
            console.log(err);
        } else {
            res.render("properties/index", {
                props: items,
                version: pjson.version,
                user: req.user,
                admin: false,
                googleapi: googleapi
            });
        }
    });
});


router.get("/new", middleware.isLoggedIn, function(req, res) {
    property.find({}).sort({name: 1}).exec(function(err, items) {
        if (err) {
            console.log(err);
        } else {
            res.render("properties/new", {
                props: items,
                version: pjson.version,
                user: req.user,
                admin: true,
                googleapi: googleapi
            });
        }
    });
});


//CREATE - add new property to DB
router.post("/new", middleware.isLoggedIn, function(req, res) {
     // get data from form and add to portfolios array
    const author = {
        id: req.user._id,
        username: req.user.username
    }

    const convertedSlug = slugify(req.body.slug);

    const newProp = {
        title: req.body.title,
        slug: convertedSlug,
        location: req.body.location,
        status: req.body.status,
        mImage: req.body.mImage,
        gImage: req.body.gImage,
        devDesc: req.body.devDesc,
        propDesc: req.body.propDesc,
        bed: req.body.bed,
        bath: req.body.bath,
        hba: req.body.hba,
        bsmnt: req.body.bsmnt,
        ter: req.body.ter,
        swim: req.body.swim,
        total: req.body.total,
        plot: req.body.plot,
        price: req.body.price,
        author: author,
        date : new Date()
    }

    console.log(newProp);
    // // Create a new Property and save to DB
    property.create(newProp, function(err, newProp) {
        if (err) {
            console.log(err);
        } else {
            req.flash("success", newProp.title + " Property Created");
            res.redirect('/properties/' + newProp.slug);
        }
    });
});



// EDIT Foundation ROUTE
router.get("/:slug/edit", middleware.isLoggedIn, function(req, res) {
    
    property.find().sort({name: 1}).exec(function(err, items) {
        if (err) {
            console.log(err);
        } else {

            property.findOne({slug: req.params.slug}).exec(function(err, foundObject) {
                
                if (err) {
                    console.log(err);
                } else {

                    user.findById(foundObject.author, function (err, author) { 

                        pageVersion = [];
                        pageVersion.push(foundObject.__v, foundObject.author.username);

                        res.render("properties/edit", {
                            prop: foundObject,
                            props: items,
                            version: pjson.version,
                            user: req.user,
                            admin: true,
                            googleapi: googleapi
                        });
                    });
                    
                }
            });
        }
    });
});


 // UPDATE Page ROUTE
router.put("/:slug", middleware.isLoggedIn, function(req, res) {

    const author = {
        id: req.user._id,
        username: req.user.username
    }

    req.body.page.updated = new Date();

    const convertedSlug = slugify(req.body.page.slug);

    const updatedProp = {
        __v: pageVersion[0] + 1,
        title: req.body.page.title,
        slug: convertedSlug,
        location: req.body.page.location,
        status: req.body.page.status,
        mImage: req.body.page.mImage,
        gImage: req.body.page.gImage,
        devDesc: req.body.page.devDesc,
        propDesc: req.body.page.propDesc,
        bed: req.body.page.bed,
        bath: req.body.page.bath,
        hba: req.body.page.hba,
        bsmnt: req.body.page.bsmnt,
        ter: req.body.page.ter,
        swim: req.body.page.swim,
        total: req.body.page.total,
        plot: req.body.page.plot,
        price: req.body.page.price,
        author: author
    }

    property.findOneAndUpdate({slug: req.params.slug}, updatedProp, function(err, updatedObject) {
        if (err) {
            req.flash("error", "Couldn't update page");
            res.redirect("/properties/" + req.params.slug);
            
        } else {
            req.flash("success", "Updated \"" + updatedProp.title + "\" successfully");
            res.redirect("/properties/" + updatedProp.slug);
        }
    });
    
});

// SHOW - shows more info about one Foundation
router.get("/:slug", function(req, res) {

    property.find().sort({name: 1}).exec(function(err, allObjects) {
        if (err) {
            console.log(err);
        } else {

            property.find({slug: req.params.slug}).exec(function(err, foundObject) {

                if (err) {
                    console.log(err);
                } else {

                    if( typeof foundObject[0] === "undefined") {
                        res.render("error",{
                            message: "Sorry this page couldn't be found.",
                            admin: false
                        });
                    }

                    else {
                        res.render("properties/show", {
                            prop: foundObject[0],
                            props: allObjects,
                            version: pjson.version,
                            user: req.user,
                            admin: false,
                            googleapi: googleapi
                        });
                    }
                }
            });
        }
    });
});

// DESTROY foundations ROUTE
router.delete("/:slug", function(req, res) {
    property.findOne({slug: req.params.slug}).exec(function(err, foundObject) {
        if (err) {
            console.log(err);
        } else {
            property.findByIdAndRemove(foundObject._id, function(err) {
                if (err) {
                    res.redirect("/");
                } else {
                    res.redirect("/");
                    req.flash("success", "Page was deleted");
                }
            });
        }
    });
});


module.exports = router;