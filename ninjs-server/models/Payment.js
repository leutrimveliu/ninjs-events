const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "First name required"],
  },

  lastName: {
    type: String,
    required: [true, "Last name required"],
  },
  cardNo: {
    type: Number,
    required: [true, "Card Number required"],
  },
  address: {
    type: String,
    required: [true, "Address required"],
  },
  city: {
    type: String,
    required: [true, "City required"],
  },
  stateCountry: {
    type: String,
    required: [true, "Country required"],
  },
  zipCode: {
    type: Number,
    required: [true, "Zip code required"],
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  event_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  tickets: {
    type: Number,
    // min: 1,
    required: true,
    default: 0,
  },
  priceTotal: {
    type: Number,
    // min: 1,
    required: true,
    default: 0,
  },
});
module.exports = mongoose.model("Payment", paymentSchema);
