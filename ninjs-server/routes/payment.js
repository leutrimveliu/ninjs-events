const express = require("express");
const Payment = require("../models/Payment");
const Event = require("../models/Events");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const router = express.Router();
const { validationResult, check } = require("express-validator");

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
  Payment.find(function (err, payment) {
    if (err) return next(err);
    res.json(payment);
  });
});

// router.get("/:id", verifyToken, async function (req, res, next) {
//   jwt.verify(req.token, "secretkey", async (err, authData) => {
//     if (err) {
//       console.log("Unaothorized User");
//       res.sendStatus(403);
//     } else {
//       Event.find({ user_id: req.params.id }, async function (err, event) {
//       if (err) return next(err);
//       res.json(event);
//     })
//     }
//   })
// });
router.get("/profile/:id", verifyToken, async function (req, res, next) {
  jwt.verify(req.token, "secretkey", async (err, authData) => {
    if (err) {
      console.log("Unaothorized User");
      res.sendStatus(403);
    } else {
      let dateNow = moment().format("YYYY-MM-DD");
      Payment.find({ user_id: req.params.id }, function (err, payment) {
        if (err) return next(err);
        var eventBook = [];
        payment.map((bookings) => {
          eventBook.push(bookings.event_id);
        });
        // console.log(eventBook);
        // Event.find({ _id: { $in: eventBook } }, function (err, event) {
        //   if (err) return next(err);
        //   res.json(event);
        // });
        if (req.query.date === "present") {
          Event.find(
            { _id: { $in: eventBook }, startDate: { $gte: dateNow } },
            function (err, event) {
              if (err) return next(err);
              res.json(event);
            }
          );
        } else if (req.query.date === "past") {
          Event.find(
            { _id: { $in: eventBook }, startDate: { $lt: dateNow } },
            function (err, event) {
              if (err) return next(err);
              res.json(event);
            }
          );
        }
      });
    }
  });
});

router.get("/:id", verifyToken, async function (req, res, next) {
  jwt.verify(req.token, "secretkey", async (err, authData) => {
    if (err) {
      console.log("Unaothorized User");
      res.sendStatus(403);
    } else {
      try {
        Event.find({ user_id: req.params.id })
          .then(function (payment) {
            var eventBook = [];
            payment.map((bookings) => {
              eventBook.push(bookings._id);
            });

            return Promise.all(eventBook);
          })
          .then(function (result) {
            var eventBook2 = [];
            result.map((book) => {
              eventBook2.push(
                Payment.aggregate([
                  {
                    $project: {
                      tickets: {
                        $cond: [
                          {
                            $eq: [
                              "$event_id",
                              mongoose.Types.ObjectId(book._id),
                            ],
                          },
                          "$tickets",
                          0,
                        ],
                      },
                    },
                  },
                  {
                    $group: {
                      _id: null,
                      total: {
                        $sum: "$tickets",
                      },
                    },
                  },
                ])
              );
            });

            return Promise.all(eventBook2);
          })
          .then(function (result2) {
            Event.find({ user_id: req.params.id }, function (error, events) {
              if (error) return next(error);
              var eventBookings = [];
              events.map((bookings, index) => {
                eventBookings.push({
                  _id: bookings._id,
                  eventPhoto: bookings.eventPhoto,
                  eventTitle: bookings.eventTitle,
                  eventCategory: bookings.eventCategory,
                  eventDescription: bookings.eventDescription,
                  eventLocation: bookings.eventLocation,
                  eventTickets: bookings.eventTickets,
                  startDate: bookings.startDate,
                  endDate: bookings.endDate,
                  user_id: bookings.user_id,
                  booking: result2[index][0].total,
                  isApproved: bookings.isApproved,
                });
              });
              res.json(eventBookings);
            });
          });
      } catch (e) {
        console.log(e);
        res.sendStatus(500);
      }
    }
  });
});

/* GET SINGLE payment BY ID */
// router.get("/:id", function (req, res, next) {
//   Payment.findById(req.params.id, function (err, post) {
//     if (err) return next(err);
//     res.json(post);
//   });
// });

const urlencodedParser = bodyParser.urlencoded({ extended: false });
router.post(
  "/",
  urlencodedParser,
  [
    check("name", "Name must be as least 3 characters long!").isLength({
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
  [
    check(
      "cardNo",
      "Card Number must be at least 16 characters long and maximum 20 characters!"
    )
      .isNumeric()
      .isLength({
        min: 16,
        max: 20,
      }),
  ],
  [
    check("address", "Address must be at least 6 characters long!").isLength({
      min: 6,
    }),
  ],
  [
    check("city", "City must be at least 3 characters long!").isLength({
      min: 3,
    }),
  ],
  [
    check("stateCountry", "State must be at least 4 characters long!").isLength(
      {
        min: 4,
      }
    ),
  ],
  [
    check(
      "zipCode",
      "Zip Code must be at least 4 characters  and maximum 6 characters!"
    )
      .isNumeric()
      .isLength({
        min: 4,
        max: 6,
      }),
  ],
  function (req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors);
      } else {
        Payment.find(
          { user_id: req.body.user_id, event_id: req.body.event_id },
          function (err, post) {
            if (err) return next(err);
            if (post.length < 1) {
              // Event.find(
              //   { eventTickets: req.body.eventTickets },
              Event.findById(req.body.event_id, function (error, event) {
                if (error) return next(error);
                console.log(event.eventTickets, req.body.tickets);
                if (event.eventTickets > 0) {
                  // console.log('event sold out')
                  // res.json("This event has been sold out");
                  // return
                  if (event.eventTickets >= req.body.tickets) {
                    console.log("you can book this event");

                    Promise.all([
                      // Payment.create(req.body, function (errormg, post) {
                      //   if (errormg) return next(errormg);
                      //   // res.json("Payment submitted successfully!");
                      // }),
                      // const event = new Event({
                      //   eventPhoto: uploadName,
                      //   eventTitle: req.body.eventTitle,
                      //   eventCategory: req.body.eventCategory,
                      //   eventDescription: req.body.eventDescription,
                      //   eventLocation: req.body.eventLocation,
                      //   eventPrice: req.body.eventPrice,
                      //   eventTickets: req.body.eventTickets,
                      //   startDate: req.body.eventStart,
                      //   endDate: req.body.eventEnd,
                      //   user_id: req.body.user_id,
                      // });

                      // await event.save();
                      Payment.create(
                        {
                          name: req.body.name,
                          lastName: req.body.lastName,
                          cardNo: req.body.cardNo,
                          address: req.body.address,
                          city: req.body.city,
                          stateCountry: req.body.stateCountry,
                          zipCode: req.body.zipCode,
                          user_id: req.body.user_id,
                          event_id: req.body.event_id,
                          tickets: req.body.tickets,
                          priceTotal: req.body.tickets * event.eventPrice,
                        },
                        function (errormg, post) {
                          if (errormg) return next(errormg);
                        }
                      ),
                      Event.findByIdAndUpdate(
                        req.body.event_id,
                        // { eventTickets: eventTickets - req.body.tickets},
                        { eventTickets: event.eventTickets - req.body.tickets },
                        (errorms, data) => {
                          if (errorms) return errorms;
                          // res.json("Event Updated successfully!");
                          // return;
                        }
                      ),
                    ]).then((data) => {
                      res.json({
                        successMessage: "You have booked the event!",
                        errMessage: false,
                      });
                      return;
                    });
                  } else {
                    res.json({
                      successMessage: false,
                      errMessage:
                        "You have chosen more than the number of available tickets",
                    });
                    return;
                  }
                } else {
                  res.json({
                    successMessage: false,
                    errMessage: "This event has been sold out",
                  });
                  return;
                }
              });
            } else {
              res.json({
                successMessage: false,
                errMessage: "User has already booked this event",
              });
              return;
            }
          }
        );
      }
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }
);

/* UPDATE Payment */
// router.put("/:id", function (req, res, next) {
//   console.log(req.body);
//   Payment.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
//     if (err) return next(err);
//     res.json(post);
//   });
// });

/* DELETE Payment */
router.delete("/:id", function (req, res, next) {
  Payment.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});
module.exports = router;
