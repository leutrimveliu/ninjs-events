var Register = require("../models/User");
var express = require("express");
var mongoose = require("mongoose");
const bodyParser = require("body-parser");
var router = express.Router();
const jwt = require("jsonwebtoken");
const { validationResult, check } = require("express-validator");
const md5 = require("md5");

function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers["authorization"];
  // Check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    // Split at the space
    const bearer = bearerHeader.split(" ");
    // Get token from array
    const bearerToken = bearer[1];
    // Parse token
    const showToken = JSON.parse(bearerToken);
    // Set the token
    req.token = showToken.token;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }
}

/* GET ALL Payment */
router.get("/", function (req, res, next) {
  Register.find(function (err, register) {
    if (err) return next(err);
    res.json(register);
  });
});

/* GET SINGLE payment BY ID */
router.get("/:id", function (req, res, next) {
  Register.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

// deletes an user by id
router.delete("/", (req, res, next) => {
  register
    .destroy({ where: { id: req.query._id } })
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
});

const urlencodedParser = bodyParser.urlencoded({ extended: false });
router.post(
  "/",
  urlencodedParser,
  [
    check("firstName", "Name must be as least 3 characters long!").isLength({
      min: 3,
    }),
  ],
  [
    check("lastName", "Last Name must be at least 3 characters long!").isLength(
      {
        min: 3,
      }
    ),
  ],
  // [check("registerRole", "Select one!").not().isEmpty()],
  [
    check("email", "Email must contain @ and 3 characters long!")
      .isLength()
      .isEmail({
        min: 3,
      }),
  ],

  [
    check("password", "Password must be at least 6 characters long!").isLength({
      min: 6,
      max: 15,
    }),
  ],

  async function (req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors);
        res.json(errors);
      } else {
        const email = req.body.email;
        let user = await Register.findOne({ email });
        if (user) {
          // res.json("This email already exists!");
          res.json({
            successMessage: false,
            errMessage: "This email already exists!",
          });

          return;
        } else {
          const dataBody = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: md5(req.body.password),
          };
          Register.create(dataBody, function (err, post) {
            if (err) return next(err);
            // res.json("You have been registred successfully!");
            res.json({
              successMessage: "You have been registred successfully!",
              errMessage: false,
            });
            return;
          });
        }
      }
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }
);
router.put("/:id", verifyToken, function (req, res) {
  jwt.verify(req.token, "secretkey", async (err, authData) => {
    if (err) {
      console.log("Unaothorized User");
      res.sendStatus(403);
    } else {
      try {
        const compareUserId = authData.user._id;
        // Check if user_id of the event has been maliciously modified
        if (compareUserId == req.body.user_id) {
          if (req.body.adm_id == "5faa6b4c03499f05f018ea96") {
            Register.findByIdAndUpdate(
              req.params.id,
              { role_id: req.body.role_id },
              (error, data) => {
                if (error) return error;
                res.json("Event Updated successfully!");
              }
            );
          }
          // });
        }
      } catch (e) {
        console.log(e);
        res.sendStatus(500);
      }
    }
  });
});

router.put("/editprofile/:id", verifyToken, function (req, res) {
  jwt.verify(req.token, "secretkey", async (err, authData) => {
    if (err) {
      console.log("Unaothorized User");
      res.sendStatus(403);
    } else {
      try {
        const compareUserId = authData.user._id;

        // Check if user_id of the event has been maliciously modified
        if (compareUserId == req.params.id) {
          const checkPsw = await Register.find({
            _id: req.params.id,
            password: md5(req.body.oldPassword),
          })
            .countDocuments()
            .exec();

          if (checkPsw > 0) {
            Register.findByIdAndUpdate(
              req.params.id,
              {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                password: md5(req.body.password),
              },
              (error, data) => {
                if (error) return error;
                // res.json("User Updated successfully!");
                res.json({
                  successMessage: "Account data has been updated successfully!",
                  errMessage: false,
                });
              }
            );
          } else {
            res.json({
              successMessage: false,
              errMessage: "You have typed the wrong password!",
            });
          }
        } else {
          res.json({
            successMessage: false,
            errMessage: "You have no permissions to make this change",
          });
        }
      } catch (e) {
        console.log(e);
        res.sendStatus(500);
      }
    }
  });
});

/* DELETE User */
router.delete("/:id", function (req, res, next) {
  Register.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});
module.exports = router;
