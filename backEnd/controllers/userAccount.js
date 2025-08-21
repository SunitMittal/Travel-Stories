const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.createAccount = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password)
      return res
        .status(400)
        .json({ success: false, msg: "All Fields are required" });

    const isUser = await User.findOne({ email });
    if (isUser)
      return res
        .status(400)
        .json({ success: false, msg: "User already exist" });

    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ fullName, email, password: hashPassword });

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1hr",
      }
    );
    res.status(200).json({
      success: true,
      user: { fullName: user.fullName, email: user.email },
      accessToken,
      msg: "Registration successful",
    });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, msg: "All Fields are required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ success: false, msg: "User not found" });

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword)
      return res.status(400).json({ success: false, msg: "Invalid password" });

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1hr",
      }
    );
    res.status(200).json({
      success: true,
      user: { fullName: user.fullName, email: user.email },
      accessToken,
      msg: "Login successful",
    });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

exports.userProfile = async (req, res) => {
  try {
    const { userId } = req.user;

    const isUser = await User.findOne({ _id: userId });
    if (!isUser)
      return res.status(401);

    res.status(200).json({
      success: true,
      user: isUser,
      msg: "User Profile fetched",
    });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};
