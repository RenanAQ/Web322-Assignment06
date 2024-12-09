/*********************************************************************************
WEB322 – Assignment 06
I declare that this assignment is my own work in accordance with Seneca  Academic Policy.
No part *  of this assignment has been copied manually or electronically from any other source (including 3rd party web sites) or distributed to other students.

Name: Renan de Alencar Queiroz
Student ID: 129280236
Date: Dec 11, 2024
Replit Web App URL: 
GitHub Repository URL: 
********************************************************************************/


const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const clientSessions = require("client-sessions");
const exphbs = require("express-handlebars");
const storeService = require("./store-service");
const authService = require("./auth-service");

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// Handlebars setup
app.engine(
  ".hbs",
  exphbs.engine({
    extname: ".hbs",
    helpers: {
      navLink: function (url, options) {
        return (
          '<li class="nav-item"><a ' +
          (url == app.locals.activeRoute
            ? ' class="nav-link active" '
            : ' class="nav-link" ') +
          'href="' +
          url +
          '">' +
          options.fn(this) +
          "</a></li>"
        );
      },
      equal: function (lvalue, rvalue, options) {
        if (arguments.length < 3) throw new Error("Handlebars Helper equal needs 2 parameters");
        return lvalue != rvalue ? options.inverse(this) : options.fn(this);
      },
      safeHTML: function (context) {
        return new Handlebars.SafeString(context);
      },
    },
  })
);
app.set("view engine", ".hbs");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  clientSessions({
    cookieName: "session",
    secret: "long_random_secret_string",
    duration: 2 * 60 * 1000,
    activeDuration: 1000 * 60,
  })
);

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// Login helper middleware
function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    next();
  }
}

// Routes
app.get("/", (req, res) => res.render("about"));

app.get("/login", (req, res) => res.render("login"));
app.get("/register", (req, res) => res.render("register"));

app.post("/register", (req, res) => {
  authService
    .registerUser(req.body)
    .then(() => res.render("register", { successMessage: "User created" }))
    .catch((err) => res.render("register", { errorMessage: err, userName: req.body.userName }));
});

app.post("/login", (req, res) => {
  req.body.userAgent = req.get("User-Agent");
  authService
    .checkUser(req.body)
    .then((user) => {
      req.session.user = {
        userName: user.userName,
        email: user.email,
        loginHistory: user.loginHistory,
      };
      res.redirect("/items");
    })
    .catch((err) => res.render("login", { errorMessage: err, userName: req.body.userName }));
});

app.get("/logout", (req, res) => {
  req.session.reset();
  res.redirect("/");
});

app.get("/userHistory", ensureLogin, (req, res) => res.render("userHistory", { user: req.session.user }));

app.get("/items", ensureLogin, (req, res) => {
  storeService.getAllItems().then((data) => res.render("items", { items: data })).catch(() => res.status(500).send("Error retrieving items"));
});

// Handle unmatched routes
app.use((req, res) => res.status(404).sendFile(path.join(__dirname, "/views/404.html")));

// Database initialization and server start
authService
  .initialize()
  .then(storeService.initialize)
  .then(() => {
    app.listen(HTTP_PORT, () => console.log(`Server running on port ${HTTP_PORT}`));
  })
  .catch((err) => console.error(`Unable to start server: ${err}`));