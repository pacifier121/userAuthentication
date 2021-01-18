//jshint esversion:6
require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const passportLocalMongoose = require('passport-local-mongoose');


const app = express();

app.use(session({
  secret : "My little secret",
  resave : false,
  saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.set("useCreateIndex", true);

mongoose.connect("mongodb://127.0.0.1:27017/secretsDB",
              {useNewUrlParser : true, useUnifiedTopology : true});

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended : true
}));

const userSchema = new mongoose.Schema({
  email : String,
  password : String
});

userSchema.plugin(passportLocalMongoose);


const User = mongoose.model("user", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/", (req, res)=>{
  res.render("home");
});

app.get("/login", (req, res)=>{
  res.render("login");
});

app.get("/register", (req, res)=>{
  res.render("register");
});

app.get("/secrets", (req, res)=>{
  if (req.isAuthenticated()){
    res.render("secrets");
  }
  else{
    res.redirect("/login");
  }
});

app.get("/logout", (req, res)=>{
  req.logout();
  res.redirect("/");
});

app.post("/register", (req, res)=>{

  User.register({username : req.body.username},req.body.password, (err, user)=>{
  if (err){
    console.log(err);
    res.redirect("/register");
  }
  else{
    passport.authenticate("local")(req,res, ()=>{
      res.redirect("/secrets");
    });
  }
  });

});

app.post("/login", (req, res)=>{
  let user = new User({
    username : req.body.username,
    password : req.body.password
  });

  req.login(user, (err)=>{
    if (err) console.log(err);
    else{
      passport.authenticate("local")(req, res, ()=>{
          res.redirect("/secrets");
      });
    }
  });
});





app.listen(3000, ()=>{
  console.log("Server startd on port no. 3000");
});
