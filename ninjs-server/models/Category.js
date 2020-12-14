const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  eventCategory: {
    type: String,
    required: [true, "Category required"],
  },
});

module.exports = mongoose.model("Category", categorySchema);
