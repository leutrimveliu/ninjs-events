const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("./DB");
const payment = require("../routes/payment");
const event = require("../routes/event");
const register = require("../routes/register");
const login = require("../routes/auth");
const editEvent = require("../routes/editEvent");
const Event = require("../models/Events");
const Category = require("../models/Category");
const role = require("../routes/role");
const category = require("../routes/category");

mongoose.Promise = global.Promise;

mongoose
  .connect(config.DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });

require("dotenv").config();
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.use("/assets/uploads/", express.static("./assets/uploads/"));
app.use("/assets/uploads/", express.static("./assets/uploads/"));
app.use(cors());
app.use("/payment", payment);
app.use("/event", event);
app.use("/register", register);
app.use("/auth", login);

app.use("/editEvent", editEvent);
app.use("/role", role);
app.use("/category", category);
// app.use("/categories", function (req, res, next) {
//   res.json(Event.schema.path("eventCategory").enumValues);
// });

/* GET ALL eventLocation */
app.use("/locations", function (req, res, next) {
  res.json(Event.schema.path("eventLocation").enumValues);
});
// app.use('/contacts', contacts);
// app.use('/employees', employees);

var port = process.env.PORT || 4000;

app.listen(port, function () {
  console.log("NodeJS Server Port: ", port);
});
