/*********************************************************************************
WEB322 – Assignment 06
I declare that this assignment is my own work in accordance with Seneca Academic Policy.
No part * of this assignment has been copied manually or electronically from any other source (including 3rd party web sites) or distributed to other students.

Name: Renan de Alencar Queiroz
Student ID: 129280236
Date: Dec 11, 2024
Replit Web App URL: 
GitHub Repository URL: 
********************************************************************************/

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define the User schema
const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  loginHistory: [
    {
      dateTime: {
        type: Date,
        required: true,
      },
      userAgent: {
        type: String,
        required: true,
      },
    },
  ],
});

let User;

module.exports.initialize = function () {
  return new Promise((resolve, reject) => {
    const db = mongoose.createConnection("mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority");

    db.on("error", (err) => {
      reject(err); // Reject the promise with the provided error
    });

    db.once("open", () => {
      User = db.model("users", userSchema);
      resolve(); // Successfully connected and initialized
    });
  });
};

module.exports.registerUser = function (userData) {
  return new Promise((resolve, reject) => {
    if (userData.password !== userData.password2) {
      reject("Passwords do not match");
      return;
    }

    bcrypt
      .hash(userData.password, 10)
      .then((hash) => {
        const newUser = new User({
          userName: userData.userName,
          email: userData.email,
          password: hash,
          loginHistory: [],
        });

        return newUser.save();
      })
      .then(() => resolve("User successfully registered"))
      .catch((err) => {
        if (err.code === 11000) {
          reject("Username already taken");
        } else {
          reject(`There was an error creating the user: ${err.message}`);
        }
      });
  });
};

module.exports.checkUser = function (userData) {
  return new Promise((resolve, reject) => {
    User.findOne({ userName: userData.userName })
      .then((user) => {
        if (!user) {
          reject(`Unable to find user: ${userData.userName}`);
          return;
        }

        bcrypt
          .compare(userData.password, user.password)
          .then((isMatch) => {
            if (!isMatch) {
              reject(`Incorrect Password for user: ${userData.userName}`);
              return;
            }

            user.loginHistory.push({
              dateTime: new Date(),
              userAgent: userData.userAgent,
            });

            return User.updateOne(
              { userName: user.userName },
              { $set: { loginHistory: user.loginHistory } }
            );
          })
          .then(() => resolve(user))
          .catch((err) => reject(`There was an error verifying the user: ${err.message}`));
      })
      .catch((err) => reject(`Unable to find user: ${err.message}`));
  });
};