const express = require("express");
const cors = require("cors");
const connectDB = require("./database");
const routes = require("./api/routes");
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:8081"],
  })
);

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(routes);

const port = process.env.APP_PORT || 3100;
app.listen(port, () => console.log(`App is running at port:${port}!`));
