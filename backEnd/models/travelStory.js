const mongoose = require("mongoose");

const travelStorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    story: {
      type: String,
      required: true,
    },
    visitedLocations: {
      type: [String],
      default: [],
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageUrl: {
      type: String,
      required: false,
      default: "",
    },
    visitedDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TravelStory", travelStorySchema);
