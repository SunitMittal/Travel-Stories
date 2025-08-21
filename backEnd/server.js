const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config();
const app = express();
app.use(express.json());

app.use(cors({ origin: "*", credentials: true }));

const port = process.env.PORT;
app.listen(port, () => console.log(`server running on port ${port}`));

const connectDB = require("./config/dbConnection");
connectDB();

const routes = require("./routes/routes");
app.use("/", routes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
