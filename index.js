const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const userRoutes = require("./src/routes/userRoutes");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.mongoUri);

// Use user routes
app.use("/api/user", userRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
