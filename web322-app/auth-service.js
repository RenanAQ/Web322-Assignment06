/*********************************************************************************
WEB322 – Assignment 06
I declare that this assignment is my own work in accordance with Seneca  Academic Policy.
No part *  of this assignment has been copied manually or electronically from any other source (including 3rd party web sites) or distributed to other students.

Name: Renan de Alencar Queiroz
Student ID: 129280236
Date: Dec 06, 2024
Replit Web App URL: 
GitHub Repository URL: 
********************************************************************************/

const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let userSchema = new Schema({
  userName: {
    type: String,
    unique: true,
  },
  password: String,
  email: String,
  loginHistory: [{
    dateTime: Date,
    userAgent: String,
  }],
});

let User;

//Assignment 06
module.exports.initialize = function () {
  return new Promise(function (resolve, reject) {
    let db = mongoose.createConnection(
      "mongodb+srv://rdealencarqueiroz:seneca@clusterrenandbs311.1zt0p.mongodb.net/"
    );

    db.on("error", (err) => {
      reject(err); // reject the promise with the provided error
    });
    db.once("open", () => {
      User = db.model("users", userSchema);
      resolve();
    });
  });
};

//Assignment 06
function registerUser(userData) {
  return new Promise(function (resolve, reject) {
    if (userData.password !== userData.password2) {
      reject("Passwords do not match");
      return;
    }
    const newUser = new User({
      userName: userData.username,
      userAgent: userData.userAgent,
      email: userData.email,
      password: userData.password,
    });
    newUser
      .save()
      .then(() => {
        resolve();
      })
      .catch((err) => {
        if (err.code === 11000) {
          reject("Username already taken");
        } else {
          reject("There was an error creating the user: " + err);
        }
      });
  });
}

//Assignment 06
function checkUser(userData) {
  return new Promise((resolve, reject) => {
    User.find({ userName: userData.userName })
      .then((users) => {
        if (users.length === 0) {
          reject("Unable to find user: " + userData.userName);
        }
        const user = users[0]; // There should only be one user

        if (user.password !== userData.password) {
          reject("Incorrect password for user: " + userData.userName);
        }
        user.loginHistory.push({
          dateTime: new Date().toString(),
          userAgent: userData.userAgent,
        });
        User.updateOne(
          { userName: user.userName },
          { $set: { loginHistory: user.loginHistory } }
        )
        .then(() => {
          resolve(user);
        })
        .catch((err) => {
          reject(`There was an error verifying the user: ${err}`);
        });
      })
      .catch(() => {
        reject(`Unable to find user: ${userData.userName}`);
      });
  });
}
