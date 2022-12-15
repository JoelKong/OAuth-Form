//Import dependencies
const Axios = require("axios");
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
const { has } = require("config");

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

  if (findUser.accessTokens === null) return res.sendStatus(401);
  jwt.verify(
    findUser.accessTokens,
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
    expiresIn: "10m",
  });
}

//Log In
app.post("/login", async (req, res) => {
  const { keyInput, password } = req.body;

  const isUserExist = await UserModel.findOne({
    $or: [{ email: keyInput[0] }, { userName: keyInput[0] }],
  });

  if (isUserExist.password) {
    hashedPassword = await bcrypt.compare(password[0], isUserExist.password);
  } else {
    hashedPassword = false;
  }

  if (isUserExist && hashedPassword) {
    const accessToken = jwt.sign(
      { email: isUserExist.email, id: isUserExist._id },
      config.get("ACCESS_TOKEN_SECRET"),
      { expiresIn: "10m" }
    );

    const refreshToken = jwt.sign(
      { email: isUserExist.email, id: isUserExist._id },
      config.get("REFRESH_TOKEN_SECRET")
    );

    await UserModel.updateOne(
      { _id: isUserExist._id },
      { $set: { accessTokens: accessToken, refreshTokens: [refreshToken] } }
    );

    res.status(200).json({ email: isUserExist.email });
  } else {
    res.json({ type: true, msg: "Invalid User" });
  }
});

//Check Unique User
app.post("/uniqueuser", async (req, res) => {
  const { userName } = req.body;
  const isUserExist = await UserModel.findOne({ userName: userName });

  if (isUserExist) {
    res.json({ type: true, msg: "Username is Taken" });
    return;
  }
  res.end();
});

//Check User Exist, Create User and Handling of Tokens
app.post("/handletokens", async (req, res) => {
  const {
    //Google
    firstName,
    lastName,
    email,
    picture,
    //Manual
    keyInput,
    fullName,
    userName,
    password,
  } = req.body;

  if (password) {
    const salt = await bcrypt.genSalt(10);
    var hashedPassword = await bcrypt.hash(password, salt);
  }

  const isUserExist = await UserModel.findOne({
    $or: [{ email: email }, { email: keyInput }],
  });

  if (isUserExist && keyInput && isUserExist.password === undefined) {
    await UserModel.updateOne(
      { _id: isUserExist._id },
      {
        $set: {
          password: hashedPassword,
          userName: userName,
          fullName: fullName,
        },
      }
    );
  } else if (isUserExist && keyInput && isUserExist.password) {
    res.json({ type: true, msg: "User already exists" });
    return;
  }

  if (isUserExist) {
    if (email && isUserExist.profilePicture === undefined) {
      await UserModel.updateOne(
        { _id: isUserExist._id },
        { $set: { profilePicture: picture } }
      );
    }

    const accessToken = jwt.sign(
      { email: isUserExist.email, id: isUserExist._id },
      config.get("ACCESS_TOKEN_SECRET"),
      { expiresIn: "10m" }
    );

    const refreshToken = jwt.sign(
      { email: isUserExist.email, id: isUserExist._id },
      config.get("REFRESH_TOKEN_SECRET")
    );

    await UserModel.updateOne(
      { _id: isUserExist._id },
      { $set: { accessTokens: accessToken, refreshTokens: [refreshToken] } }
    );

    res.status(200).json({ email: isUserExist.email });
  } else {
    const result = await UserModel.create({
      firstName: firstName,
      lastName: lastName,
      fullName: fullName,
      email: email || keyInput,
      profilePicture: picture,
      userName: userName,
      password: hashedPassword,
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

    await UserModel.updateOne(
      { _id: result._id },
      { $set: { accessTokens: accessToken, refreshTokens: [refreshToken] } }
    );

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

  if (refreshToken === null) return res.sendStatus(401);

  if (!findUser.refreshTokens.includes(refreshToken))
    return res.sendStatus(403);

  jwt.verify(
    refreshToken,
    config.get("REFRESH_TOKEN_SECRET"),
    async (err, user) => {
      if (err) return res.sendStatus(403);
      const accessToken = await generateAccessToken({
        email: user.email,
        id: user.id,
      });

      const updateModel = await UserModel.updateOne(
        { _id: user.id },
        { accessTokens: accessToken }
      );
    }
  );
  res.sendStatus(204);
});

//Delete all Refresh Tokens Upon Logout
app.post("/logout", async (req, res) => {
  await UserModel.updateOne(
    { email: req.body.email },
    { accessTokens: "", refreshTokens: [] }
  );

  res.sendStatus(204);
});

//Get Home data
app.get("/home", authenticateToken, async (req, res) => {
  const getUser = await UserModel.findOne({ email: req.user.email });
  const { firstName, lastName, email, profilePicture, fullName } = getUser;
  const userData = { firstName, lastName, email, profilePicture, fullName };
  res.json(userData);
});
