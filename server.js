const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const swaggerUi = require('swagger-ui-express'),
swaggerDocument = require('./swagger.json');

const app = express();

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "bezkoder-session",
    secret: "COOKIE_SECRET", // should use as secret environment variable
    httpOnly: true,
    sameSite: 'strict'
  })
);

app.use(
  '/api-docs',
  swaggerUi.serve, 
  swaggerUi.setup(swaggerDocument)
);

// database
const db = require("./app/models");
const Role = db.role;
const Group = db.group;

db.sequelize.sync();
// force: true will drop the table if it already exists and create new table for role and group insert values into it
// db.sequelize.sync({force: true}).then(() => {
//   console.log('Drop and Resync Database with { force: true }');
//   initial();
// });

// home route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to user application." });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.create({
    id: 1,
    name: "user",
  });

  Role.create({
    id: 2,
    name: "moderator",
  });

  Role.create({
    id: 3,
    name: "admin",
  });

  Group.create({
    id: 1,
    name: "user_group",
  });

  Group.create({
    id: 2,
    name: "moderator_group",
  });

  Group.create({
    id: 3,
    name: "admin_group",
  });
}

