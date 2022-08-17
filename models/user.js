const mongoose = require("mongoose");
const Schema = new mongoose.Schema();
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

// adds a username and password field for us
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
