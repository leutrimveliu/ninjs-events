const Event = require("../models/Events");
const Role = require("../models/Role");
const Payment = require("../models/Payment");
const Register = require("../models/User");
const Category = require("../models/Category");
const express = require("express");
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

/* GET ALL Events . */
router.get("/", async function (req, res, next) {
  // let dateNow = moment().format("YYYY-MM-DD HH:mm:ss")
  let dateNow = moment().format("YYYY-MM-DD");
  let eventCategory = await Category.findOne({
    eventCategory: req.query.category,
  });
  const limit = parseInt(6);
  const lengthQuery = await Event.find({
    startDate: { $gte: dateNow },
    isApproved: true,
  })

    .countDocuments()
    .exec();
  let pagesNo;
  // if(lengthQuery > limit) {
  if (lengthQuery > 1) {
    pagesNo = Math.ceil(lengthQuery / limit);
  } else {
    pagesNo = lengthQuery;
  }
  if (req.query.page) {
    let page = parseInt(req.query.page);
    // const limit = parseInt(1);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};

    if (endIndex < lengthQuery) {
      results.next = {
        page: page + 1,
      };
    }
    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
      };
    }
    Event.find({ startDate: { $gte: dateNow }, isApproved: true })
      // .limit(1)
      .sort({ startDate: "ascending" })
      .limit(limit)
      .skip(startIndex)
      .exec(function (err, event) {
        if (err) return next(err);
        let prevB = null;
        let currentB = page;
        let nextB = 2;

        if (typeof results.previous !== "undefined") {
          prevB = results.previous.page;
        }
        if (typeof results.next !== "undefined") {
          nextB = results.next.page;
        } else {
          nextB = null;
        }
        res.json({
          event,
          prevB: prevB,
          currentB: currentB,
          nextB: nextB,
          // lengthB: lengthQuery,
          lengthB: pagesNo,
          pgResult: true,
        });
      });
  } else if (req.query.title) {
    Event.find({
      eventTitle: { $regex: req.query.title, $options: "i" },
      startDate: { $gte: dateNow },
      isApproved: true,
    })
      .limit(10)
      .exec(function (err, event) {
        if (err) return next(err);
        // res.json(event);
        res.json({ event: event });
      });
  } else if (req.query.category && req.query.location && req.query.date) {
    let startingDate = moment(req.query.date)
      .set({ hour: 23, minute: 59, second: 59 })
      .format("YYYY-MM-DD HH:mm:ss");
    Event.find(
      {
        eventCategory: eventCategory._id,
        eventLocation: req.query.location,
        startDate: { $gte: startingDate },
        isApproved: true,
      },
      function (err, event) {
        if (err) return next(err);
        res.json({ event: event });
      }
    );
  } else if (req.query.category && req.query.location) {
    Event.find(
      {
        eventCategory: eventCategory._id,
        eventLocation: req.query.location,
        startDate: { $gte: dateNow },
        isApproved: true,
      },
      function (err, event) {
        if (err) return next(err);
        res.json({ event: event });
      }
    );
  } else if (req.query.category && req.query.date) {
    let startingDate = moment(req.query.date)
      .set({ hour: 23, minute: 59, second: 59 })
      .format("YYYY-MM-DD HH:mm:ss");
    Event.find(
      {
        eventCategory: eventCategory._id,
        startDate: { $gte: startingDate },
        isApproved: true,
      },
      function (err, event) {
        if (err) return next(err);
        res.json({ event: event });
      }
    );
  } else if (req.query.location && req.query.date) {
    let startingDate = moment(req.query.date)
      .set({ hour: 23, minute: 59, second: 59 })
      .format("YYYY-MM-DD HH:mm:ss");
    Event.find(
      {
        eventLocation: req.query.location,
        startDate: { $gte: startingDate },
        isApproved: true,
      },
      function (err, event) {
        if (err) return next(err);
        res.json({ event: event });
      }
    );
  } else if (req.query.category) {
    Event.find(
      {
        eventCategory: eventCategory._id,
        startDate: { $gte: dateNow },
        isApproved: true,
      },
      function (err, event) {
        if (err) return next(err);
        res.json({ event: event });
      }
    );
  } else if (req.query.location) {
    Event.find(
      {
        eventLocation: req.query.location,
        startDate: { $gte: dateNow },
        isApproved: true,
      },
      function (err, event) {
        if (err) return next(err);
        res.json({ event: event });
      }
    );
  } else if (req.query.date) {
    let startingDate = moment(req.query.date)
      .set({ hour: 23, minute: 59, second: 59 })
      .format("YYYY-MM-DD HH:mm:ss");
    Event.find(
      {
        startDate: { $gte: startingDate },
        isApproved: true,
      },
      function (err, event) {
        if (err) return next(err);
        res.json({ event: event });
      }
    );
  } else {
    let page = 1;
    // const limit = parseInt(1);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};

    if (endIndex < lengthQuery) {
      results.next = {
        page: page + 1,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
      };
    }
    Event.find({ startDate: { $gte: dateNow }, isApproved: true })
      .sort({ startDate: "ascending" })
      .limit(limit)
      .exec(function (err, event) {
        if (err) return next(err);
        let prevB = null;
        let currentB = page;
        let nextB = 2;

        if (typeof results.previous !== "undefined") {
          prevB = results.previous.page;
        }
        if (typeof results.next !== "undefined") {
          nextB = results.next.page;
        } else {
          nextB = null;
        }
        res.json({
          event,
          prevB: prevB,
          currentB: currentB,
          nextB: nextB,
          lengthB: pagesNo,
          pgResult: true,
        });
      });
  }
});

router.get("/popular", async function (req, res, next) {
  let dateNow = moment().format("YYYY-MM-DD");

  const appointments = await Payment.aggregate([
    {
      $group: {
        _id: "$event_id",
        total: {
          $sum: "$tickets",
        },
      },
    },
    { $sort: { total: -1 } },
  ]);

  const ph = appointments.map((items) => {
    return items._id;
  });
  // console.log(ph)
  Event.find({ _id: { $in: ph }, startDate: { $gte: dateNow } })
    .limit(10)
    .exec(function (err, event) {
      if (err) return next(err);
      // console.log(event)
      res.json(event);
    });
});

router.get("/free", async function (req, res, next) {
  let dateNow = moment().format("YYYY-MM-DD");
  Event.find({ eventPrice: 0, startDate: { $gte: dateNow }, isApproved: true })
    .limit(10)
    .exec(function (err, event) {
      if (err) return next(err);
      // console.log(event)
      res.json(event);
    });
});

router.get("/paid", async function (req, res, next) {
  let dateNow = moment().format("YYYY-MM-DD");
  Event.find({
    eventPrice: { $gt: 0 },
    startDate: { $gte: dateNow },
    isApproved: true,
  })
    .limit(10)
    .exec(function (err, event) {
      if (err) return next(err);
      // console.log(event)
      res.json(event);
    });
});

// router.get("/search", async function (req, res, next) {
//   // const name = "John"
//   // UserSchema.find({name: {$regex: name, $options: 'i'}}).limit(5);
//   console.log(req.query.title)
//   let dateNow = moment().format("YYYY-MM-DD");
//   Event.find({ eventTitle: {$regex: req.query.title, $options: 'i'}, startDate: { $gte: dateNow }, isApproved: true }).limit(10).exec(function(err, event) {
//     if (err) return next(err);
//     // console.log(event)
//     res.json(event);
//   });
// });

router.get("/admin", async function (req, res, next) {
  await Event.find(function (err, event) {
    if (err) return next(err);
    res.json(event);
  });
});

router.get("/:id", function (req, res, next) {
  Event.findById(req.params.id, function (err, event) {
    if (err) return next(err);
    res.json(event);
  });
});

router.post("/booking/:id", function (req, res, next) {
  // jwt.verify(req.token, "secretkey", async (err, authData) => {
  //   if (err) {
  //     console.log("Unaothorized User");
  //     res.sendStatus(403);
  //   } else {
  Payment.find(
    { user_id: req.body.user_id, event_id: req.params.id },
    function (err, post) {
      if (err) return next(err);
      // console.log(req.body);
      if (post.length < 1) {
        Event.findById(req.params.id, function (err, event) {
          if (err) return next(err);
          // const message = false;
          // const message = 1;
          const message = 2;
          res.json({ event, message });
        });
      } else {
        Event.findById(req.params.id, function (err, event) {
          if (err) return next(err);
          // const message = true;
          // const message = 2;
          const message = 1;
          res.json({ event, message });
        });
      }
    }
  );
  //   }
  // });
});
/**/
let uploadName;
const storage = multer.diskStorage({
  // destination: "./assets/uploads",
  destination: "./assets/uploads",
  filename: function (req, file, cb) {
    uploadName =
      file.fieldname + "-" + Date.now() + path.extname(file.originalname);
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
  // check("eventOrganizer", "Event Organizer can not be empty!").not().isEmpty(),
  check("eventLocation", "Event Location can not be empty!").not().isEmpty(),
  check("eventPrice", "Event Price can not be empty!").not().isEmpty(),
  check("eventTickets", "Event Tickets can not be empty!").not().isEmpty(),
  check("eventStart", "Event starting date can not be empty!").not().isEmpty(),
  check("eventEnd", "Event ending date can not be empty!").not().isEmpty(),
];

router.post("/", upload, verifyToken, validationChecks, function (req, res) {
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
            if (err) return err;
            const validateRoleId = await event.role_id;

            if (validateRoleId == "5faa6b7503499f05f018ea97") {
              const errors = validationResult(req);

              if (!errors.isEmpty()) {
                console.log(errors);
                await unlinkAsync(`./assets/uploads/${uploadName}`);
                // res.json(errors);
                res.json({
                  successMessage: false,
                  errMessage: errors,
                });
              } else {
                const event = new Event({
                  eventPhoto: uploadName,
                  eventTitle: req.body.eventTitle,
                  eventCategory: req.body.eventCategory,
                  eventDescription: req.body.eventDescription,
                  eventLocation: req.body.eventLocation,
                  eventPrice: req.body.eventPrice,
                  eventTickets: req.body.eventTickets,
                  startDate: req.body.eventStart,
                  endDate: req.body.eventEnd,
                  user_id: req.body.user_id,
                });

                await event.save();

                // res.json("file uploaded");
                res.json({
                  successMessage: "You have created an event successfully!",
                  errMessage: false,
                });
              }
            } else {
              console.log("You dont have permission to create an event!");
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
