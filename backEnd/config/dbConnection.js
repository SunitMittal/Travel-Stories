const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose
    .connect(process.env.DB_URL)
    .then(() => {
      console.log("MongoDB Connected");
    })
    .catch((err) => {
      console.log("Failed to Connect DB", err);
      process.exit(1);
    });
};

module.exports = connectDB;
