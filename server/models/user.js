const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  phoneNumber: { type: String },
  email: { type: String, required: true },
  password: { type: String, required: true },
  profilePicture: { type: String, required: true },
  id: { type: String },
});

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
