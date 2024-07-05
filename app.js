const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const swaggerjsdoc = require("swagger-jsdoc");
const swaggerui = require("swagger-ui-express");
const app = express();

app.use(cors());
app.options("*", cors());

const categoriesRouter = require("./routers/categories");
const ordersRouter = require("./routers/orders");
const productsRouter = require("./routers/products");
const usersRouter = require("./routers/users");
const auth = require("./helpers/jwt");
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E_shop",
      version: "1.0.0",
      description: "Documentation for APIs of the online shop",
      contact: {
        name: "MUGABE INEZA Promesse",
        email: "mugabepromesse@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000/",
      },
    ],
  },
  apis: ["./routers/*.js"],
};

const errorHandler = require("./helpers/error-handler");

require("dotenv/config");
const api = process.env.API_URL;

//middlewares
app.use(bodyParser.json());
app.use(morgan("tiny"));

app.use(`${api}/categories`, categoriesRouter);
app.use(`${api}/orders`, ordersRouter);
app.use(`${api}/products`, productsRouter);
app.use(`${api}/users`, usersRouter);
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
app.use(errorHandler);

mongoose
  .connect("mongodb://127.0.0.1:27017/eshop_database")
  .then(() => {
    console.log("Connected to MongoDB...");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

const spacs = swaggerjsdoc(options);
app.use("/api-docs", swaggerui.serve, swaggerui.setup(spacs));
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App is listening on port: ${port}`);
});
