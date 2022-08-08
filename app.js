const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const Campgound = require("./models/campground");
const methodOverrid = require("method-override");
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

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(methodOverrid("_method"));
app.use(
  express.urlencoded({
    extended: true,
  })
);

// base route
app.get("/", (req, res) => {
  res.render("home");
});

// route to get all campgrounds
app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campgound.find({});
  res.render("campgrounds/index", { campgrounds });
});

// route to show form for adding new campground
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

// route to post new campground
app.post("/campgrounds", async (req, res, next) => {
  try {
    const campground = new Campgound(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  } catch (error) {
    next(error);
  }
});

// route for single campground based on id
app.get("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const campground = await Campgound.findById(id);
  res.render("campgrounds/show", { campground });
});

// route to serve up form to edit campground
app.get("/campgrounds/:id/edit", async (req, res) => {
  const { id } = req.params;
  const campground = await Campgound.findById(id);
  res.render("campgrounds/edit", { campground });
});

// route that updates the campground
app.put("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const campground = await Campgound.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  res.redirect(`/campgrounds/${campground._id}`);
});

// route to delete campground
app.delete("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  await Campgound.findByIdAndDelete(id);
  res.redirect("/campgrounds");
});

app.use((err, req, res, next) => {
  res.send("Something went wrong");
});

app.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`);
});
