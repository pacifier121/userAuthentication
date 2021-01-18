//jshint esversion:6
require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const md5 = require('md5');

const app = express();

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


const User = mongoose.model("user", userSchema);





app.get("/", (req, res)=>{
  res.render("home");
});

app.get("/login", (req, res)=>{
  res.render("login");
});

app.get("/register", (req, res)=>{
  res.render("register");
});

app.post("/register", (req, res)=>{
  const newUser = new User({
    email : req.body.email,
    password : md5(req.body.password)
  });
  newUser.save((err)=>{
    if (err){
      console.log(err);
    }
    else{
      res.render("secrets");
    }
  });
});

app.post("/login", (req, res)=>{
  let query = {email : req.body.email,
              password : md5(req.body.password)};
  User.findOne(query , (err, users)=>{
    if (err){
      console.log(err);
    }
    else{
      if (users !== []){
        res.render("secrets");
      }
    }
  });
});





app.listen(3000, ()=>{
  console.log("Server startd on port no. 3000");
});
