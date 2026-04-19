const mongoose = require("mongoose");
const { default: passportLocalMongoose } = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

UserSchema.plugin(passportLocalMongoose, {
  usernameField: "email", // Use email as the username field
  errorMessages: {
    IncorrectPasswordError: "Password is incorrect",
    IncorrectUsernameError: "Email not found",
    MissingUsernameError: "Please enter your email",
    MissingPasswordError: "Please enter your password",
  },
});

module.exports = mongoose.model("User", UserSchema);
