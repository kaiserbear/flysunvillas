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


router.get("/new", middleware.isLoggedIn, function(req, res) {
    property.find({}).sort({name: 1}).exec(function(err, items) {

        if (err) {
            console.log(err);
        } else {
            res.render("properties/new", {
                props: items,
                version: pjson.version,
                user: req.user,
                admin: true
            });
        }
    });
});

//CREATE - add new property to DB
router.post("/new", middleware.isLoggedIn, function(req, res) {
     // get data from form and add to portfolios array
    const author = {
        id: req.user._id,
        username: req.user.username,
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
        bath: req.body.bed,
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

    // Create a new Property and save to DB
    // pages.create(newProp, function(err, newProp) {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         req.flash("success", newProp.name + " Property Created");
    //         res.redirect('/' + newProp.slug);
    //     }
    // });
});


module.exports = router;