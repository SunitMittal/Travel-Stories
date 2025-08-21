const multer = require("multer");
const path = require("path");
const fs = require("fs");

exports.imgUpload = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ success: false, msg: "No image uploaded" });

    const imageUrl = `http://localhost:8000/uploads/${req.file.filename}`;

    return res.status(200).json({ success: true, imageUrl, msg: "image uploaded" });
  } catch (err) {
    return res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

exports.imgdelete = async (req, res) => {
  try {
    const { imageUrl } = req.query;
    if (!imageUrl)
      return res.status(400).json({
        success: false,
        msg: "image URL parameter is required",
      });

    const filename = path.basename(imageUrl);
    const filepath = path.join(__dirname, '..', "uploads", filename);

    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      return res
        .status(200)
        .json({ success: true, msg: "image deleted successfully" });
    } else
      return res.status(400).json({ success: false, msg: "image not found" });
  } catch (err) {
    return res.status(500).json({ msg: "Server Error", error: err.message });
  }
};
