const mongoose = require("mongoose");

const eventsSchema = mongoose.Schema({
  eventPhoto: { type: String, required: true },
  eventTitle: { type: String, required: true },
  eventCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  eventDescription: { type: String, required: true },
  // eventOrganizer: {
  //   type: String,
  //   enum: ["Personal", "Company"],
  //   required: true,
  // },
  eventLocation: {
    type: String,
    enum: [
      "Prishtine",
      "Gjilan",
      "Ferizaj",
      "Fushe Kosove",
      "Prizren",
      "Gjakove",
      "Peje",
      "Mitrovice",
    ],
    required: true,
  },
  eventTickets: {
    type: Number,
    required: true,
    default: 0,
  },
  startDate: {
    type: Date,
    default: Date.now,
    min: Date.now,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isApproved: {
    type: Boolean,
    default: false,
    required: true,
  },
  eventPrice: {
    type: Number,
    default: 0,
    required: true,
  },
});

module.exports = mongoose.model("Event", eventsSchema);
