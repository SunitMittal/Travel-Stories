const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Enter name"],
    },
    email: {
      type: String,
      required: [true, "Enter email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Enter password"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
