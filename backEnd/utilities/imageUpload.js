const multer = require("multer");
const path = require("path");

// configure storage
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./uploads/"); //current destination is upload folder, change it to aws
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + path.extname(file.originalname)); //this will create unique filename
  },
});

const fileFilter = (req, file, callback) => {
  if (file.mimetype.startsWith("image/"))
    callback(null, true);
  else
    callback(new Error("Only images are allowed"), false);
};

const upload = multer({ storage, fileFilter });
module.exports = upload;
