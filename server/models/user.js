const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String },
  email: { type: String, required: true },
  password: { type: String },
  profilePicture: { type: String, required: true },
  id: { type: String },
});

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
