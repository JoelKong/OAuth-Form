const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  fullName: { type: String },
  phoneNumber: { type: String },
  email: { type: String, required: true },
  userName: { type: String },
  password: { type: String },
  profilePicture: { type: String },
  id: { type: String },
  accessTokens: { type: String },
  refreshTokens: { type: [String] },
});

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
