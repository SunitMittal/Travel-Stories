const express = require("express");
const router = express.Router();

const {
  createAccount,
  login,
  userProfile,
} = require("../controllers/userAccount");
const {
  addStory,
  fetchAllStory,
  updateStory,
  deleteStory,
  updateIsFavourite,
  searchStory,
  filterStory,
} = require("../controllers/travelStory");
const { imgUpload, imgdelete } = require("../controllers/imgUpload");

const { authenticateToken } = require("../utilities/jwtVerify");
const upload = require("../utilities/imageUpload");

router.post("/signup", createAccount);
router.post("/login", login);

router.get("/get-user", authenticateToken, userProfile);

router.post("/add-story", authenticateToken, addStory);
router.get("/get-all-story", authenticateToken, fetchAllStory);
router.put("/update-story/:id", authenticateToken, updateStory);
router.delete("/delete-story/:id", authenticateToken, deleteStory);

router.put("/update-is-favourite/:id", authenticateToken, updateIsFavourite);
router.get("/search", authenticateToken, searchStory);
router.get("/travel-stories/filter", authenticateToken, filterStory);

router.post("/img-upload", upload.single("image"), imgUpload);
router.delete("/img-delete", imgdelete);

module.exports = router;
