//Import dependencies
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
require("dotenv").config();

//Import Collections
const UserModel = require("./models/user");

//Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI || process.env.API_KEY);

//Middleware
app.use(express.json());
app.use(cors());

//Start Server
app.listen(process.env.PORT || 3001, () =>
  console.log("Server running on port 3001")
);

//Check User Exist and Create User
app.post("/checkuserexist", async (req, res) => {
  const { firstName, lastName, email, picture } = req.body;
  const isUserExist = await UserModel.findOne({ email: email });

  if (isUserExist) {
    return res.json(isUserExist);
  } else {
    const result = await UserModel.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      profilePicture: picture,
    });

    const accessToken = jwt.sign(
      { email: result.email, id: result._id },
      config.get("ACCESS_TOKEN_SECRET"),
      { expiresIn: "4h" }
    );

    res.status(200).json([result, accessToken]);
  }
});
