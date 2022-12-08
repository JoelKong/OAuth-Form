//Import dependencies
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
// const bcrypt = require("bcryptjs");
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

//Checking whether token is valid
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, config.get("ACCESS_TOKEN_SECRET"), (err, user) => {
    console.log(err);
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

//Generate Access Token
function generateAccessToken(user) {
  return jwt.sign(user, config.get("ACCESS_TOKEN_SECRET"), {
    expiresIn: "10m",
  });
}

//Check User Exist, Create User and Handling of Tokens
app.post("/handletokens", async (req, res) => {
  const { firstName, lastName, email, picture } = req.body;
  const isUserExist = await UserModel.findOne({ email: email });

  if (isUserExist) {
    const accessToken = jwt.sign(
      { email: isUserExist.email, id: isUserExist._id },
      config.get("ACCESS_TOKEN_SECRET"),
      { expiresIn: "10m" }
    );

    const refreshToken = jwt.sign(
      { email: isUserExist.email, id: isUserExist._id },
      config.get("REFRESH_TOKEN_SECRET")
    );

    isUserExist.refreshTokens.push(refreshToken);
    await isUserExist.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 days
    });

    res.status(200).json({ accessToken: accessToken });
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
      { expiresIn: "10m" }
    );
    const refreshToken = jwt.sign(
      { email: result.email, id: result._id },
      config.get("REFRESH_TOKEN_SECRET")
    );

    result.refreshTokens.push(refreshToken);
    await result.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 days
    });

    res.status(200).json({ accessToken: accessToken });
  }
});

//Create Refresh Tokens
app.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);

  const findUser = UserModel.findOne({ _id: req.body._id });
  if (!findUser.refreshTokens.includes(refreshToken))
    return res.sendStatus(403);

  jwt.verify(refreshToken, config.get("REFRESH_TOKEN_SECRET"), (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({
      email: user.email,
      id: user._id,
    });
    res.json({ accessToken: accessToken });
  });
});

//Delete all Refresh Tokens Upon Logout
app.delete("/logout", async (req, res) => {
  //delete refresh tokens using filter and db
  const findUser = await UserModel.findOne({ _id: req.body._id });
  findUser.refreshTokens = findUser.refreshTokens.filter(
    (token) => token !== req.body.token
  );
  await findUser.save();
  res.sendStatus(204);
});

app.get("/home", authenticateToken, (req, res) => {
  console.log(req.user.email);
});
