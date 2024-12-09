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

const express = require("express");
const path = require("path");
const app = express();
const storeService = require("./store-service"); //importing my module
const itemData = require("./store-service");
const Handlebars = require("handlebars");
const authData = require(".auth-service");

//assigment04 - helpers
const exphbs = require("express-handlebars");
app.engine(
  ".hbs",
  exphbs.engine({
    extname: ".hbs", // Use .hbs extension for templates
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
        if (arguments.length < 3)
          throw new Error("Handlebars Helper equal needs 2 parameters");
        return lvalue != rvalue ? options.inverse(this) : options.fn(this);
      },
      safeHTML: function (context) {
        return new Handlebars.SafeString(context); // Use SafeString from imported Handlebars
      },
    },
  })
);
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "views"));

const cloudinary = require("./cloudinaryConfig");
const multer = require("multer");
const streamifier = require("streamifier");
const upload = multer();

// Setting the port number to listen on
const HTTP_PORT = process.env.PORT || 8080;

//Assignmet 03:  Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

//CSS & images, JS
app.use(express.static("public"));

//assignment04
app.use(function (req, res, next) {
  let route = req.path.substring(1);
  app.locals.activeRoute =
    "/" +
    (isNaN(route.split("/")[1])
      ? route.replace(/\/(?!.*)/, "")
      : route.replace(/\/(.*)/, ""));
  app.locals.viewingCategory = req.query.category;
  next();
});

//assignment 05
app.get("/categories/add", (req, res) => {
  res.render("addCategory");
});
//assignment 05
app.post("/categories/add", (req, res) => {
  storeService
    .addCategory(req.body)
    .then(() => {
      res.redirect("/categories");
    })
    .catch((err) => {
      res.status(500).send("Unable to Add Category");
    });
});
//assignment 05
app.get("/categories/delete/:id", (req, res) => {
  storeService
    .deleteCategoryById(req.params.id)
    .then(() => {
      res.redirect("/categories");
    })
    .catch((err) => {
      res.status(500).send("Unable to Remove Category / Category not found");
    });
});
//assignment 05
app.get("/items/delete/:id", (req, res) => {
  storeService
    .deletePostById(req.params.id)
    .then(() => {
      res.redirect("/items"); // Redirect to the items view
    })
    .catch((err) => {
      res.status(500).send("Unable to Remove Item / Item not found");
    });
});

// / route:
app.get("/", (req, res) => {
  res.render("about");
});

// ABOUT route: //Assignment 04
app.get("/about", (req, res) => {
  res.render("about");
});

// shop route: --> assignment04
app.get("/shop", async (req, res) => {
  // Declare an object to store properties for the view
  let viewData = {};

  try {
    // declare empty array to hold "item" objects
    let items = [];

    // if there's a "category" query, filter the returned items by category
    if (req.query.category) {
      // Obtain the published "item" by category
      items = await itemData.getPublishedItemsByCategory(req.query.category);
    } else {
      // Obtain the published "items"
      items = await itemData.getPublishedItems();
    }

    // sort the published items by itemDate
    items.sort((a, b) => new Date(b.itemDate) - new Date(a.itemDate));

    // get the latest item from the front of the list (element 0)
    let item = items[0];

    // store the "items" and "item" data in the viewData object (to be passed to the view)
    viewData.posts = items;
    viewData.post = item;
  } catch (err) {
    viewData.message = "no results";
  }

  try {
    let categories = await itemData.getCategories();

    viewData.categories = categories;
  } catch (err) {
    viewData.categoriesMessage = "no results";
  }

  res.render("shop", { data: viewData });
});
app.get("/shop/:id", async (req, res) => {
  // Declare an object to store properties for the view
  let viewData = {};
  try {
    // Obtain the item by "id" and store in viewData
    viewData.item = await storeService.getItemById(req.params.id);
    // If there's a "category" query, filter the returned items by category
    if (req.query.category) {
      viewData.items = await storeService.getPublishedItemsByCategory(
        req.query.category
      );
    } else {
      viewData.items = await storeService.getPublishedItems();
    }
    // Sort items by itemDate in descending order
    viewData.items.sort((a, b) => new Date(b.itemDate) - new Date(a.itemDate));
    // Obtain the full list of categories
    viewData.categories = await storeService.getCategories();
  } catch (err) {
    console.error(err);
    viewData.message = "No results found";
  }
  // Render the "shop" view with all of the data (viewData)
  res.render("shop", { data: viewData });
});

// ITEMS route: (Static HTML) - Assignment 04 --> assignment05
app.get("/items", async (req, res) => {
  let viewData = {};

  try {
    // Get all items
    const items = await storeService.getAllItems();
    if (items.length > 0) {
      viewData.items = items;
    } else {
      viewData.message = "no results";
    }
  } catch (err) {
    viewData.message = "no results";
  }

  try {
    // Get all categories
    const categories = await storeService.getCategories();
    if (categories.length > 0) {
      viewData.categories = categories;
    } else {
      viewData.categoriesMessage = "no categories available";
    }
  } catch (err) {
    viewData.categoriesMessage = "no categories available";
  }
  res.render("items", { data: viewData });
});
// Route to get a specific item by ID - Assignment 03
app.get("/item/:id", (req, res) => {
  storeService
    .getItemById(req.params.id)
    .then((data) => res.json(data))
    .catch((err) => res.json({ message: err }));
});

// items route:
app.get("/api/items", (req, res) => {
  storeService
    .getAllItems()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({ message: err });
    });
});

// CATEGORIES route: (Static HTML) --> assignment05
app.get("/categories", async (req, res) => {
  let viewData = {};

  try {
    // Get all categories
    const categories = await storeService.getCategories();
    if (categories.length > 0) {
      viewData.categories = categories;
    } else {
      viewData.message = "no results";
    }
  } catch (err) {
    viewData.message = "no results";
  }
  res.render("categories", { data: viewData });
});
//Assignment 03: adding the item route (Static HTML) --> assignment 05
app.get("/items/add", (req, res) => {
  storeService
    .getCategories()
    .then((categories) => {
      res.render("addItem", { categories }); // Pass the categories to the view
    })
    .catch(() => {
      res.render("addItem", { categories: [] }); // Render with an empty array if no categories
    });
});

//Assignment 03: adding the item route
app.post("/items/add", upload.single("featureImage"), (req, res) => {
  if (req.file) {
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    async function upload(req) {
      let result = await streamUpload(req);
      console.log(result);
      return result;
    }

    upload(req).then((uploaded) => {
      processItem(uploaded.url);
    });
  } else {
    processItem("");
  }

  function processItem(imageUrl) {
    req.body.featureImage = imageUrl;
    storeService
      .addItem(req.body)
      .then(() => res.redirect("/items"))
      .catch((err) => res.json({ message: err }));
  }
});

// Handle unmatched routes with a custom 404 page
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "/views/404.html"));
});

// Listen on this port to run the website locally
storeService
  .initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`Express http server listening on port: ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.log("Failed to initialize data: ", err);
  });
