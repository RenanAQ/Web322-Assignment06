const Sequelize = require("sequelize");

// set up sequelize to point to our postgres database
const sequelize = new Sequelize("Web322DB", "Web322DB_owner", "hD0YrliTC9ts", {
  host: "ep-silent-glade-a5xw62a3-pooler.us-east-2.aws.neon.tech",
  dialect: "postgres",
  port: 5432,
  dialectOptions: {
    ssl: { rejectUnauthorized: false },
  },
});

// Define a "Project" model
const Project = sequelize.define("Project", {
  title: Sequelize.STRING,
  description: Sequelize.TEXT,
});

// synchronize the Database with our models and automatically add the
// table if it does not exist
sequelize.sync().then(() => {
  // create a new "Project" and add it to the database
  Project.create({
    title: "Project1",
    description: "First Project",
  })
    .then((project) => {
      // you can now access the newly created Project via the variable project
      console.log("success!");
    })
    .catch((error) => {
      console.log("something went wrong!");
    });
});
