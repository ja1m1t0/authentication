//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

const mdbpwd = process.env.MONGODB;
mongoose.connect(
  `mongodb+srv://jaydu:` +
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
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    const newUser = new User({
      email: req.body.username,
      password: hash,
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
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ email: username })
    .then((user) => {
      //   console.log(user);
      if (user) {
        bcrypt.compare(password, user.password, function (err, result) {
          if (result === true) {
            res.render("secrets");
          } else {
            res.send("Nice try user, you are not welcome.");
          }
        });
      } else {
        res.send("You are not welcome at all!");
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

app.listen("3000", (req, res) => {
  console.log("Server running on port 3000");
});
