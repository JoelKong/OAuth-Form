//Import dependencies
const Axios = require("axios");
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
async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const email = authHeader && authHeader.split(" ")[1];
  const findUser = await UserModel.findOne({ email: email });

  //  try {
  //    jwt.verify(findUser.accessTokens[0], config.get("ACCESS_TOKEN_SECRET"));
  //  } catch (TokenExpiredError) {
  //    res.sendStatus(403)
  //   tokenExpired = true;
  // }

  //   await Axios.post("http://localhost:3001/token", {
  //     email: email,
  //   });

  if (findUser.accessTokens[0] == null) return res.sendStatus(401);
  jwt.verify(
    findUser.accessTokens[0],
    config.get("ACCESS_TOKEN_SECRET"),
    (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    }
  );
}

//Generate Access Token
async function generateAccessToken(user) {
  return jwt.sign(user, config.get("ACCESS_TOKEN_SECRET"), {
    expiresIn: "1m",
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
      { expiresIn: "1m" }
    );

    const refreshToken = jwt.sign(
      { email: isUserExist.email, id: isUserExist._id },
      config.get("REFRESH_TOKEN_SECRET")
    );

    isUserExist.accessTokens.push(accessToken);
    isUserExist.refreshTokens.push(refreshToken);
    await isUserExist.save();

    res.status(200).json({ email: email });
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
      { expiresIn: "1m" }
    );
    const refreshToken = jwt.sign(
      { email: result.email, id: result._id },
      config.get("REFRESH_TOKEN_SECRET")
    );

    result.accessTokens.push(accessToken);
    result.refreshTokens.push(refreshToken);
    await result.save();

    // res.cookie("refreshToken", refreshToken, {
    //   httpOnly: true,
    //   sameSite: "lax",
    //   maxAge: 60 * 60 * 24, // 1 days
    // });

    res.status(200).json({ email: result.email });
  }
});

//Create Refresh Tokens
app.post("/token", async (req, res) => {
  const findUser = await UserModel.findOne({ email: req.body.email });

  const refreshToken =
    findUser.refreshTokens[findUser.refreshTokens.length - 1];

  if (refreshToken == null) return res.sendStatus(401);

  if (!findUser.refreshTokens.includes(refreshToken))
    return res.sendStatus(403);

  jwt.verify(
    refreshToken,
    config.get("REFRESH_TOKEN_SECRET"),
    async (err, user) => {
      if (err) return res.sendStatus(403);
      const accessToken = await generateAccessToken({
        email: user.email,
        id: user._id,
      });
      findUser.accessTokens = [];
      findUser.accessTokens.push(accessToken);
      await findUser.save();
    }
  );
});

//Delete all Refresh Tokens Upon Logout
app.delete("/logout", async (req, res) => {
  //delete refresh tokens using filter and db
  const findUser = await UserModel.findOne({ email: req.body.email });
  findUser.accessTokens = [];
  findUser.refreshTokens = [];
  // findUser.refreshTokens = findUser.refreshTokens.filter(
  //   (token) =>
  //     token !== findUser.refreshTokens[findUser.refreshTokens.length - 1]
  // );
  await findUser.save();
  localStorage.clear();
  res.sendStatus(204);
});

//Get Home data
app.get("/home", authenticateToken, async (req, res) => {
  const getUser = await UserModel.findOne({ email: req.user.email });
  const { firstName, lastName, email, profilePicture } = getUser;
  const userData = { firstName, lastName, email, profilePicture };
  res.json(userData);
});
