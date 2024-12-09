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


const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  title: String,
  body: String,
  postDate: Date,
  featureImage: String,
  published: Boolean,
  category: String,
});

const categorySchema = new mongoose.Schema({
  name: String,
});

const Item = mongoose.model("Item", itemSchema);
const Category = mongoose.model("Category", categorySchema);

module.exports.initialize = function () {
  return mongoose
    .connect("mongodb+srv://username:password@cluster.mongodb.net/database", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => Promise.reject(`Error connecting to MongoDB: ${err}`));
};

module.exports.getAllItems = function () {
  return Item.find().exec();
};

module.exports.getCategories = function () {
  return Category.find().exec();
};

module.exports.addItem = function (itemData) {
  const newItem = new Item(itemData);
  newItem.postDate = new Date();
  return newItem.save();
};

module.exports.addCategory = function (categoryData) {
  const newCategory = new Category(categoryData);
  return newCategory.save();
};

module.exports.deleteCategoryById = function (id) {
  return Category.findByIdAndDelete(id).exec();
};

module.exports.deleteItemById = function (id) {
  return Item.findByIdAndDelete(id).exec();
};