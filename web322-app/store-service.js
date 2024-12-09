/*********************************************************************************
WEB322 – Assignment 06
I declare that this assignment is my own work in accordance with Seneca  Academic Policy.
No part *  of this assignment has been copied manually or electronically from any other source (including 3rd party web sites) or distributed to other students.

Name: Renan de Alencar Queiroz
Student ID: 129280236
Date: Dec 06, 2024
Replit Web App URL: https://d12d110b-3a3f-4e66-a3ab-39eaa42f3852-00-1g6zeqkizhj1y.riker.replit.dev/
GitHub Repository URL: https://github.com/RenanAQ/Web322-Assignment05.git
********************************************************************************/

const fs = require("fs");
//Assignment05
const Sequelize = require("sequelize");
const { gte } = Sequelize.Op;
const sequelize = new Sequelize("Web322DB", "Web322DB_owner", "hD0YrliTC9ts", {
  host: "ep-silent-glade-a5xw62a3-pooler.us-east-2.aws.neon.tech",
  dialect: "postgres",
  port: 5432,
  dialectOptions: {
    ssl: { rejectUnauthorized: false },
  },
  query: {raw: true}
});

//assigment05 - helpers
formatDate = function(dateObj){
  let year = dateObj.getFullYear();
  let month = (dateObj.getMonth() + 1).toString();
  let day = dateObj.getDate().toString();
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2,'0')}`;
} //Instead of {{postDate}}, you can instead write {{#formatDate postDate}}{{/formatDate}}

//Assignment 05
function getAllItems() {
  return new Promise((resolve, reject) => {
    Item.findAll().then((data)=>{
      resolve('Success: ' + data)
    })
    .catch((err)=>{
      reject("no items returned");
    })
  });
}

function getPublishedItems() {
  return new Promise((resolve, reject) => {
    Item.findAll({
      where: {
        published: true,
      },
    })
      .then((data) => {
        if (data.length > 0) {
          resolve(data);
        } else {
          reject("no results returned");
        }
      })
      .catch((err) => {
        reject("no results returned: " + err);
      });
  });
}

function getCategories() {
  return new Promise((resolve, reject) => {
    Category.findAll()
      .then((data) => {
        if (data.length > 0) {
          resolve(data);
        } else {
          reject("no results returned");
        }
      })
      .catch((err) => {
        reject("no results returned: " + err);
      });
  });
}

//Assignment 05
function addItem(itemData) {
  return new Promise((resolve, reject) => {
      try {
          itemData.published = itemData.published ? true : false;
          for (let property in itemData) {
              if (itemData[property] === "") {
                  itemData[property] = null;
              }
          }
          itemData.postDate = new Date();
          Item.create(itemData)
              .then(() => {
                  resolve();
              })
              .catch((err) => {
                  reject(`Unable to create post: ${err.message || "Error occurred"}`);
              });
      } catch (error) {
          reject(`Unexpected error: ${error.message}`);
      }
  });
}
//Assignment 05
function getItemsByCategory(category) {
  return new Promise((resolve, reject) => {
    Item.findAll({
      where: { category: category }, // Filter by the category
    })
      .then((data) => {
        if (data.length > 0) {
          resolve(data); // Pass the retrieved data to resolve
        } else {
          reject("no results returned"); // No items found for the category
        }
      })
      .catch((err) => {
        reject("no results returned: " + err); // Error occurred
      });
  });
}
//Assignment 05
function getItemsByMinDate(minDateStr) {
  return new Promise((resolve, reject) => {
      // Use Sequelize's findAll method with a condition on postDate
      Item.findAll({
          where: {
              postDate: {
                  [gte]: new Date(minDateStr), // Filter by postDate greater than or equal to minDateStr
              },
          },
      })
      .then((items) => {
          // If the operation succeeds, resolve the promise with the data
          if (items && items.length > 0) {
              resolve(items);
          } else {
              // If no items are found, reject with a meaningful message
              reject('No results returned');
          }
      })
      .catch((err) => {
          // Handle any error that occurs during the operation
          reject(`Error fetching items: ${err.message || 'no results returned'}`);
      });
  });
}
//Assignment 05
function getItemById(id) {
  return new Promise((resolve, reject) => {
      Item.findAll({
          where: {
              id: id,
          },
      })
      .then((items) => {
          if (items && items.length > 0) {
              resolve(items[0]);
          } else {
      
              reject('No results returned');
          }
      })
      .catch((err) => {
          reject(`Error fetching item by ID: ${err.message || 'no results returned'}`);
      });
  });
}

function addCategory(categoryData) {
  return new Promise((resolve, reject) => {
    for (const key in categoryData) {
      if (categoryData[key] === "") {
        categoryData[key] = null;
      }
    }
    Category.create(categoryData)
      .then(() => {
        resolve("Category created successfully");
      })
      .catch((err) => {
        reject("Unable to create category: " + err);
      });
  });
}function deleteCategoryById(id) {
  return new Promise((resolve, reject) => {
    Category.destroy({
      where: { id: id },
    })
      .then((rowsDeleted) => {
        if (rowsDeleted > 0) {
          resolve("Category deleted successfully");
        } else {
          reject("Category not found");
        }
      })
      .catch((err) => {
        reject("unable to delete category: " + err);
      });
  });
}
function deletePostById(id) {
return new Promise((resolve, reject) => {
  Item.destroy({
    where: { id: id },
  })
    .then((rowsDeleted) => {
      if (rowsDeleted > 0) {
        resolve("Item deleted successfully");
      } else {
        reject("Item not found");
      }
    })
    .catch((err) => {
      reject("unable to delete item: " + err);
    });
});
}

//assigment05
function getPublishedItemsByCategory(category) {
  return new Promise((resolve, reject) => {
    Item.findAll({
      where: {
        published: true, // Filter by "published" set to true
        category: category, // Filter by the given "category"
      },
    })
      .then((data) => {
        if (data.length > 0) {
          resolve(data); // Return the filtered data
        } else {
          reject("no results returned"); // No items found
        }
      })
      .catch((err) => {
        reject("no results returned: " + err); // Error during query
      });
  });
}

// initialize()
//   .then((message) => {
//     console.log(message); // Initialize success
//     return getAllItems();
//   })
//   .then((items) => {
//     console.log("All items: ", items);
//     return getPublishedItems();
//   })
//   .then((publishedItems) => {
//     console.log("Published items: ", publishedItems);
//     return getCategories();
//   })
//   .then((categories) => {
//     console.log("Categories: ", categories);
//   })
//   .catch((err) => {
//     console.error(err);
//   });

//assigment05 - creating model - item
const Item = sequelize.define('Item', {
  body: Sequelize.TEXT,
  title: Sequelize.STRING,
  postDate: Sequelize.DATE,
  featureImage: Sequelize.STRING,
  published: Sequelize.BOOLEAN,
  price: Sequelize.DOUBLE,
});

//assigment05 - creating model - category
const Category = sequelize.define('Category', {
  category: Sequelize.STRING,
});

//assigment05 - relationship item-category
Item.belongsTo(Category, {foreignKey: 'category'});

// Exporting the functions so that they can be used in other files
module.exports = {
  initialize,
  getAllItems,
  getPublishedItems,
  getCategories,
  addItem,
  getItemsByCategory,
  getItemsByMinDate,
  getItemById,
  getPublishedItemsByCategory,
  addCategory,
  deleteCategoryById,
  deletePostById,
};
