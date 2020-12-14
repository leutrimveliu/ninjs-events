const mongoose = require("mongoose");

const roleSchema = mongoose.Schema({
  roleName: {
    type: String,
    required: [true, "Role name required"],
  },
});

module.exports = mongoose.model("Role", roleSchema);
