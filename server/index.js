//Import dependencies
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

//Import Collections

//Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI || process.env.API_KEY);

//Middleware
app.use(express.json());
app.use(cors());

//Start Server
app.listen(process.env.PORT || 3001, () =>
  console.log("Server running on port 3001")
);
