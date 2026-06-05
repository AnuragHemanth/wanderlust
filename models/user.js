const mongoose = require("mongoose");
const { default: passportLocalMongoose } = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
}, { timestamps: true });

// Use default usernameField ('username') so the app can store/display usernames
UserSchema.plugin(passportLocalMongoose, {
  errorMessages: {
    IncorrectPasswordError: "Password is incorrect",
    IncorrectUsernameError: "Username not found",
    MissingUsernameError: "Please enter your username",
    MissingPasswordError: "Please enter your password",
  },
});

module.exports = mongoose.model("User", UserSchema);
