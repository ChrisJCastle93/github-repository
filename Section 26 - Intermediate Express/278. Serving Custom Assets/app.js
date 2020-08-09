var express = require("express");
var app = express();

app.use(express.static("public")); //THIS TELLS EXPRESS WHERE TO LOOK FOR THINGS LIKE CSS FILES
app.set("view engine", ".ejs"); //TELLS EXPRESS TO ASSUME FILES ARE EJS

//CODEBASE FROM PREVIOUS LECTURE

app.get("/", function(req, res){
    res.render("home.ejs");
});

app.get("/fallinlovewith/:thing", function(req, res){
  var thing = req.params.thing;
  res.render("love.ejs", {thingVar: thing});
});

//NEW CODEBASE

app.get("/posts", function(req,res){
    var posts = [
        {title: "SPORTS", author: "Chris"},
        {title: "AINSLEY HARRIET IS THE BOMB", author: "Greg"},
        {title: "COVIDIOTS", author: "Anthony"},
    ];
    res.render("posts.ejs", {posts: posts})
});

//SERVER LISTEN
var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});