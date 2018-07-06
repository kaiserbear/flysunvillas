const express = require("express");
const app = express();
const aws = require('aws-sdk');
const router = express.Router();
const property = require("../models/properties");
const middleware = require("../middleware");
const passport = require("passport");


const S3_BUCKET = process.env.S3_BUCKET;

function getAllPropertys(string, res) {
    property.find({}, function(err, allpropertys) {
        if (err) {
            console.log(err);
        } else {
            res.render(string, {
                propertys: allpropertys
            });
        }
    });
}


//CREATE - add new property to DB
router.post("/", middleware.isLoggedIn, function(req, res) {
    var title = req.body.title;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    req.body.image1 = req.body.image1.replace(/[/\\?%*:|"<>^ ]/g, '-');

    var image1 = req.body.image1;

    var newproperty = {
        title: title,
        image1: image1,
        image2: image2,
        image3: image3,
        description: desc,
        author: author
    }

    // Create a new property and save to DB
    property.create(newproperty, function(err, newlyCreated) {

        if (err) {
            console.log(err);
        } else {
            req.flash("success", newproperty.title + " News Item Created");
            res.redirect("/");
        }
    });
});

router.get("/new", middleware.isLoggedIn, function(req, res) {
    getAllPropertys("admin/new", res);
});


router.get('/sign-s3', (req, res) => {

    // S3 Bucket Config
    const s3 = new aws.S3();
    const fileName = req.query['file-name'];
    const fileType = req.query['file-type'];
    const s3Params = {
        Bucket: S3_BUCKET,
        Key: fileName,
        Expires: 60,
        ContentType: fileType,
        ACL: 'public-read'
    };
    aws.config.region = 'eu-west-2';
    s3.getSignedUrl('putObject', s3Params, (err, data) => {
        if (err) {
            console.log(err);
            return res.end();
        }
        const returnData = {
            signedRequest: data,
            url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
        };
        res.write(JSON.stringify(returnData));
        res.end();
    });
});


// EDIT property ROUTE
router.get("/:id/edit", middleware.checkOwnership, function(req, res) {
    property.findById(req.params.id, function(err, foundProperty) {
        res.render("admin/edit", {
            property: foundProperty
        });
    });
});

// UPDATE property ROUTE
router.put("/:id", middleware.checkOwnership, function(req, res) {

    // find and update the correct property
    req.body.property.image1 = req.body.property.image1.replace(/[/\\?%*:|"<>^ ]/g, '-');

    property.findByIdAndUpdate(req.params.id, req.body.property, function(err, updatedproperty) {
        if (err) {
            res.redirect("/admin");
        } else {
            res.redirect("/admin/" + req.params.id);
        }
    });
});

// DESTROY property ROUTE
router.delete("/:id", middleware.checkOwnership, function(req, res) {
    property.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/admin");
        } else {
            res.redirect("/admin");
        }
    });
});

module.exports = router;