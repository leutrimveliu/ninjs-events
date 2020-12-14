var Role = require("../models/Role");
var express = require("express");
var mongoose = require("mongoose");
const bodyParser = require("body-parser");
var router = express.Router();
const { validationResult, check } = require("express-validator");

// /* GET ALL Roles */
router.get("/", function (req, res, next) {
  Role.find(function (err, role) {
    if (err) return next(err);
    res.json(role);
  });
});

// /* GET SINGLE Role BY ID */
// router.get("/:id", function (req, res, next) {
//   Role.findById(req.params.id, function (err, post) {
//     if (err) return next(err);
//     res.json(post);
//   });
// });

// router.post("/", function (req, res, next) {
//   try {
//     Role.create(req.body, function (err, post) {
//       if (err) return next(err);
//       res.json(post);
//     });
//   } catch (e) {
//     console.log(e);
//     res.sendStatus(500);
//   }
// });

module.exports = router;
