const express = require("express");
const Event = require("../models/Events");
const Register = require("../models/User");
const Category = require("../models/Category");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { validationResult, check } = require("express-validator");
const { promisify } = require("util");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const router = express.Router();
const unlinkAsync = promisify(fs.unlink);

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

router.get("/:id", function (req, res, next) {
  Event.findById(req.params.id, async function (err, event) {
    if (err) return next(err);
    const data1 = moment(event.startDate).format("yyyy-MM-DD");
    const data2 = moment(event.endDate).format("yyyy-MM-DD");
    res.json({ event: event, startDate: data1, endDate: data2 });
  });
});

let uploadName;
const storage = multer.diskStorage({
  destination: "./assets/uploads",
  filename: function (req, file, cb) {
    if (file.fieldname) {
      uploadName =
        file.fieldname + "-" + Date.now() + path.extname(file.originalname);
    }
    cb(null, uploadName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("eventPhoto");

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(
    path.extname(file.originalname).toLocaleLowerCase()
  );
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

const validationChecks = [
  check(
    "eventTitle",
    "Event Title must be as least 3 characters long!"
  ).isLength({ min: 3 }),
  check("eventCategory", "Event Category can not be empty!").not().isEmpty(),
  check(
    "eventDescription",
    "Event Description must be as least 10 characters long, and maximum 1200 characters!"
  ).isLength({ min: 10, max: 1200 }),
  check("eventLocation", "Event Location can not be empty!").not().isEmpty(),
  check("eventPrice", "Event Price can not be empty!").not().isEmpty(),
  // check("eventTickets", "Event Tickets can not be empty!").not().isEmpty(),
  check("eventStart", "Event starting date can not be empty!").not().isEmpty(),
  check("eventEnd", "Event ending date can not be empty!").not().isEmpty(),
];

router.put("/:id", upload, verifyToken, validationChecks, function (req, res) {
  jwt.verify(req.token, "secretkey", async (err, authData) => {
    if (err) {
      console.log("Unaothorized User");
      res.sendStatus(403);
    } else {
      try {
        const compareUserId = authData.user._id;
        // Check if user_id of the event has been maliciously modified
        if (compareUserId == req.body.user_id) {
          Register.findById(compareUserId, async function (err, user) {
            if (err) return err;
            const validateRoleId = await user.role_id;
            Event.findById(req.params.id, async function (err, event) {
              if (err) return err;
              const validateEventId = await event.user_id;
              // Check if this user is the user who created the event or is an admin
              if (
                compareUserId == validateEventId ||
                validateRoleId == "5faa6b4c03499f05f018ea96"
              ) {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                  console.log(errors);
                  if (uploadName) {
                    await unlinkAsync(`./assets/uploads/${uploadName}`);
                  }
                  // await unlinkAsync(`./assets/uploads/${uploadName}`);
                  res.json(errors);
                } else {
                  if (uploadName) {
                    // await unlinkAsync(`../assets/uploads/${event.eventPhoto}`);
                    Event.findByIdAndUpdate(
                      req.params.id,
                      {
                        eventPhoto: uploadName,
                        eventTitle: req.body.eventTitle,
                        eventCategory: req.body.eventCategory,
                        eventDescription: req.body.eventDescription,
                        eventLocation: req.body.eventLocation,
                        eventPrice: req.body.eventPrice,
                        // eventTickets: req.body.eventTickets,
                        startDate: req.body.eventStart,
                        endDate: req.body.eventEnd,
                      },
                      (error, data) => {
                        // if (error) return next(error);
                        if (error) return error;
                        res.json("Event Updated successfully!");
                      }
                    );
                  } else {
                    Event.findByIdAndUpdate(
                      req.params.id,
                      {
                        eventTitle: req.body.eventTitle,
                        eventCategory: req.body.eventCategory,
                        eventDescription: req.body.eventDescription,
                        eventLocation: req.body.eventLocation,
                        eventPrice: req.body.eventPrice,
                        // eventTickets: req.body.eventTickets,
                        startDate: req.body.eventStart,
                        endDate: req.body.eventEnd,
                      },
                      (error, data) => {
                        // if (error) return next(error);
                        if (error) return error;
                        res.json("Event Updated successfully!");
                      }
                    );
                  }
                }
              } else {
                console.log("You are not permitted to change this event!");
              }
            });
          });
        }
      } catch (e) {
        console.log(e);
        res.sendStatus(500);
      }
    }
  });
});

router.delete("/:id", verifyToken, function (req, res, next) {
  jwt.verify(req.token, "secretkey", async (err, authData) => {
    if (err) {
      console.log("Unaothorized User");
      res.sendStatus(403);
    } else {
      try {
        const compareUserId = authData.user._id;
        // Check if user_id of the event has been maliciously modified
        if (compareUserId == req.body.user_id) {
          Register.findById(compareUserId, async function (err, user) {
            if (err) return next(err);
            const validateRoleId = await user.role_id;

            Event.findById(req.params.id, async function (err, event) {
              if (err) return next(err);
              const validateEventId = await event.user_id;
              // Check if this user is the user who created the event
              if (
                compareUserId == validateEventId ||
                validateRoleId == "5faa6b4c03499f05f018ea96"
              ) {
                Event.findByIdAndRemove(req.params.id, (error, data) => {
                  if (error) return next(error);
                  res.json("Event Has been deleted!");
                });
              } else {
                console.log("You are not permitted to delete this event!");
              }
            });
          });
        }
      } catch (e) {
        console.log(e);
        res.sendStatus(500);
      }
    }
  });
});

// approve event
router.put("/approve/:id", verifyToken, function (
  req,
  res
) {
  jwt.verify(req.token, "secretkey", async (err, authData) => {
    if (err) {
      console.log("Unaothorized User");
      res.sendStatus(403);
    } else {
      try {
        const compareUserId = authData.user._id;
        // Check if user_id of the event has been maliciously modified
        if (compareUserId == req.body.user_id) {
          Register.findById(compareUserId, async function (err, event) {
            if (err) return next(err);

            const validateRoleId = await event.role_id;
            // console.log(validateRoleId);
            // Check if this user is the user who created the event or is an admin
            if (validateRoleId == "5faa6b4c03499f05f018ea96") {
              Event.findByIdAndUpdate(
                req.params.id,
                {
                  isApproved: true,
                },
                (error, data) => {
                  // if (error) return next(error);
                  if (error) return error;
                  res.json("Event Updated successfully!");
                }
              );
            } else {
              console.log("You are not permitted to change this event!");
            }
          });
        }
      } catch (e) {
        console.log(e);
        res.sendStatus(500);
      }
    }
  });
});

module.exports = router;
