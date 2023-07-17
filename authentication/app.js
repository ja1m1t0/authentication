//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");
const bcrypt = require("bcrypt");


const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

const mdbpwd = process.env.MONGODB;
mongoose.connect(
  `mongodb+srv://jai:` +
    mdbpwd +
    `@security-cluster.frmzjfb.mongodb.net/?retryWrites=true&w=majority`
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully to MongoDB");
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: md5(req.body.password)
  });

  newUser
    .save()
    .then(function () {
      res.render("secrets");
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = md5(req.body.password);
  User.findOne({ email: username })
    .then((user) => {
      //   console.log(user);
      if (user && user.password === password) {
        res.render("secrets");
      } else {
        res.send("You are not welcome");
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

app.listen("3000", (req, res) => {
  console.log("Server running on port 3000");
});
