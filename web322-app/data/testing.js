const fs = require("fs");

// Read the JSON file
fs.readFile("items.json", "utf8", (err, jsonString) => {
  if (err) {
    console.error("Error reading the file:", err);
    return;
  }

  try {
    const data = JSON.parse(jsonString); // Parse the JSON string to an array of objects
    console.log(data); // [{“smth”: 1, …, }, {...}]

    // To extract specific data, iterate over the array
    data.forEach((item) => {
      console.log(item.id); // Access "smth" property of each object
      // Access other properties of `item` as needed
    });

    // Extract all values of "smth" property
    const idValues = data.map((item) => item.id);
    console.log(idValues); // [1, ...]
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }
});

const fs = require("fs");

var items = [];
var categories = [];

var pathToItems = "./data/items.json";
var pathToCat = "./data/categories.json";

function initialize(pathToFile, arrayName) {
  return new Promise((resolve, reject) => {
    fs.readFile(pathToFile, "utf8", (err, jsonString) => {
      if (err) {
        console.error("Error reading the file:", err);
        reject("Unable to read file");
        throw err;
      }

      try {
        arrayName = JSON.parse(jsonString);
        resolve("OK");
        console.log(arrayName);
      } catch (error) {
        reject("Unable to read file");
        console.error("Error parsing JSON:", error);
      }
    });
  });
}

function initialize(pathToFile, arrayName) {
  return new Promise((resolve, reject) => {
    fs.readFile(pathToFile, "utf8", (err, jsonString) => {
      if (err) {
        console.error("Error reading the file:", err);
        reject("Unable to read file");
        throw err;
      }

      try {
        arrayName = JSON.parse(jsonString);
        resolve("OK");
        console.log(arrayName);
      } catch (error) {
        reject("Unable to read file");
        console.error("Error parsing JSON:", error);
      }
    });
  });
}

initialize(pathToItems, items)
  .then((data) => {
    console.log(data);
    return initialize(pathToCat, categories);
  })
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.log(err);
  });
