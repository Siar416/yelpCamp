const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Campgound = require("./models/campground");
const PORT = 3000;

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home");
});

// test route to check if connection to db is good
// and entry was created
app.get("/makecampground", async (req, res) => {
  const camp = new Campgound({
    title: "Backyard",
    description: "affordable camping",
  });
  await camp
    .save()
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
  res.send(camp);
});

app.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`);
});
