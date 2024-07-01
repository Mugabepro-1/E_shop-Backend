const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

app.use(cors());
app.options("*", cors());

const categoriesRouter = require("./routers/categories");
const ordersRouter = require("./routers/orders");
const productsRouter = require("./routers/products");
const usersRouter = require("./routers/users");
const auth = require("./helpers/jwt");
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
  .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/eshop_database")
  .then(() => {
    console.log("Connected to MongoDB...");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App is listening on port: ${port}`);
});
