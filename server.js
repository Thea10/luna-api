//const Joi = require('joi');
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const express = require("express");
const server = express();

var corsOptions = {
  origin: "*",
};

const UserRoutes = require("./routes/user.routes");
const AdminRoutes = require("./routes/admin.routes");
server.use(cors(corsOptions));

//parse req
server.use(bodyParser.json());
server.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const connectionUrl = "mongodb://localhost/luna2";
mongoose
  .connect(connectionUrl, {
    //useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to local database..."))
  .catch((err) => console.error("Could not connect to database:", err));

UserRoutes(server);
AdminRoutes(server);

const port = process.env.PORT || 9000;

server.get("/", (req, res) =>
  res.json({
    message: "Luna Honey Server",
  })
);
server.listen(port, () =>
  console.log(`Luna Honey Server running on port: ${port}`)
);
