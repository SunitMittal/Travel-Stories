const TravelStory = require("../models/travelStory");
const path = require("path");
const fs = require("fs");
const { start } = require("repl");

exports.addStory = async (req, res) => {
  try {
    const { title, story, visitedLocations, imageUrl, visitedDate } = req.body;
    const { userId } = req.user;

    if (!title || !story || !visitedLocations || !imageUrl || !visitedDate)
      return res
        .status(400)
        .json({ success: false, msg: "All Fields are required" });

    const parsedVisitedDate = new Date(parseInt(visitedDate));

    const travelStory = await TravelStory.create({
      title,
      story,
      visitedLocations,
      userId,
      imageUrl,
      visitedDate: parsedVisitedDate,
    });

    res.status(200).json({
      success: true,
      travelStory,
      msg: "Story Added successful",
    });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

exports.fetchAllStory = async (req, res) => {
  try {
    const { userId } = req.user;

    const travelStories = await TravelStory.find({ userId: userId }).sort({
      isFavourite: -1,
    });

    res.status(200).json({
      success: true,
      stories: travelStories,
      msg: "All Stories fetched successful",
    });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

exports.updateStory = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, story, visitedLocations, imageUrl, visitedDate } = req.body;
    const { userId } = req.user;

    if (!title || !story || !visitedLocations || !visitedDate)
      return res
        .status(400)
        .json({ success: false, msg: "All Fields are required" });

    const parsedVisitedDate = new Date(parseInt(visitedDate));

    const travelStory = await TravelStory.findOne({ _id: id, userId: userId });

    if (!travelStory)
      return res
        .status(400)
        .json({ success: false, msg: "Travel Story not found" });

    travelStory.title = title;
    travelStory.story = story;
    travelStory.visitedLocations = visitedLocations;
    travelStory.imageUrl = imageUrl !== undefined ? imageUrl : travelStory.imageUrl;
    travelStory.visitedDate = parsedVisitedDate;

    await travelStory.save();

    return res.status(200).json({
      success: true,
      travelStory,
      msg: "Story update successful",
    });
  } catch (err) {
    return res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

exports.deleteStory = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const travelStory = await TravelStory.findOne({ _id: id, userId: userId });

    if (!travelStory)
      return res
        .status(400)
        .json({ success: false, msg: "Travel Story not found" });

    await travelStory.deleteOne({ _id: id, userId: userId });

    const imageUrl = travelStory.imageUrl;
    if (imageUrl && imageUrl.trim() !== "") {
      try {
        const filename = path.basename(imageUrl);
        const filepath = path.join(__dirname, "..", "uploads", filename);

        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
          console.log(`Image file deleted: ${filename}`);
        }
      } catch (fileError) {
        console.error("Error deleting image file:", fileError.message);
      }
    }

    return res.status(200).json({
      success: true,
      travelStory,
      msg: "Story Deleted successful",
    });
  } catch (err) {
    return res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

exports.updateIsFavourite = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    const { isFavourite } = req.body;

    const travelStory = await TravelStory.findOne({ _id: id, userId: userId });

    if (!travelStory)
      return res
        .status(400)
        .json({ success: false, msg: "Travel Story not found" });

    travelStory.isFavourite = isFavourite;

    await travelStory.save();

    res.status(200).json({
      success: true,
      story: travelStory,
      msg: "update successful",
    });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

exports.searchStory = async (req, res) => {
  try {
    const { query } = req.query;
    const { userId } = req.user;

    if (!query)
      return res.status(400).json({ success: false, msg: "query required" });

    const searchResult = await TravelStory.find({
      userId: userId,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { story: { $regex: query, $options: "i" } },
        { visitedLocations: { $regex: query, $options: "i" } },
      ],
    }).sort({ isFavourite: -1 });

    res.status(200).json({
      success: true,
      story: searchResult,
    });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

exports.filterStory = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const { userId } = req.user;

    const start = new Date(parseInt(startDate));
    const end = new Date(parseInt(endDate));

    const filteredStories = await TravelStory.find({
      userId: userId,
      visitedDate: { $gte: start, $lte: end },
    }).sort({ isFavourite: -1 });

    res.status(200).json({
      success: true,
      story: filteredStories,
    });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};
