// ALL THE REST CAMPGROUNDS ROUTES
// REPLACED app. with router. throughout
// ADD module.export to the bottom

var express = require("express"); // MUST REQUIRE AGAIN IN THIS FILE
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campground");   // Campground AND Comment not defined in this doc, so need to link them
var Comment = require("../models/comment");
let { checkCommentOwnership, isLoggedIn, isPaid } = require("../middleware");
router.use(isLoggedIn, isPaid);

// =============================
// COMMENTS ROUTES
// =============================

// COMMENTS NEW FORM

router.get("/new", isLoggedIn, function(req, res){    // ADDED isLoggedIn FUNCTION TO FORCE USERS TO SIGN IN
    Campground.findOne({slug: req.params.slug}, function(err, campground){           // FIND CAMPGROUND BY ID
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});           // RENDER A NEW COMMENT PAGE OFF THE BACK OF THAT ID
        }
    }) 
});

// COMMENTS CREATE

router.post("/", isLoggedIn, function(req, res){       // ADDED isLoggedIn FUNCTION TO FORCE USERS TO SIGN IN
    Campground.findOne({slug: req.params.slug}, function(err, campground){           // LOOKUP CAMPGROUND USING ID
        if(err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment){    // req.body.comment IS PROPERTY OF WHAT IS SUBMITTED FROM THE FORM, BECAUSE WE USED COMMENT[PROPERTY] AS THE NAMES
            if(err){                                                        // Comment.create uses the required comment.js file we created, then creates a comment based on the function here.   
                console.log(err);
            } else {
                // add username and id to comment
                // req.user            // CONTAINS THE INFORMATION .username req.user._id;
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                comment.save(); //SAVES DATA
                campground.comments.push(comment);                      // PUSHES THE NEW COMMENT THAT WAS SUBMITTED BY THE FORM INTO THE COMMENTS OF THE CAMPGROUND IT WAS SUBMITTED FROM
                campground.save();   
                req.flash("success", "successfully added comment");                                   // SAVES DATA
                res.redirect("/campgrounds/" + campground.slug);             // REDIRECTS TO THE CAMPGROUND'S SHOW PAGE USING THE ID
            };
            });
        };
    });
});

///////// REST EDIT CAMPGROUND FORM

router.get("/:comment_id/edit", checkCommentOwnership, function(req,res){            
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_slug: req.params.slug, comment: foundComment});        // WE MADE UP CAMPGROUND_ID IN new.ejs THEN PUTTING IT IN HERE. CAN USE req.params as it will give us the campground because it's first in the list
        }
    })
});

///////// REST UPDATE COMMENT

router.put("/:comment_id", checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){ // req.body.comment BECAUSE OF ITS NAME IN THE EDIT.EJS FILE
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.slug);
   }
});
});

///////// REST DESTROY CAMPGROUND

router.delete("/:comment_id", checkCommentOwnership, function(req,res){                     // comment_id COMES FROM URL?
Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if(err){
        res.redirect("/campgrounds/" + req.params.slug);
    } else {
        req.flash("success", "Comment deleted");
        res.redirect("/campgrounds/" + req.params.slug);
    }
})
})

////////////////////////////////////////////////////

module.exports = router;