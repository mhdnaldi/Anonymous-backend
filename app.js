require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const socket = require("socket.io");
const navigation = require("./src/navigation");

const app = express();
app.use(cors());
app.use(express.static("uploads"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use("/", navigation);
app.use("*", (req, res) => {
  res.send("404 PAGE NOT FOUND!").status(404);
});

const http = require("http");
const server = http.createServer(app);
const io = socket(server);

server.listen(process.env.PORT, () => {
  console.log(`listening for request on port: ${process.env.PORT}`);
});
