const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CampgoundSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
});

module.exports = mongoose.model("Campgound", CampgoundSchema);
