const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const methodOverrid = require("method-override");
const PORT = 3000;

const campgrounds = require("./routes/campgrounds");
const reviews = require("./routes/reviews");

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

app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", reviews);

// base route
app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  // res.send(new ExpressError("Sorry Page Not Found", 404));
  next(new ExpressError("Sorry Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something Went Wrong";
  res.status(statusCode).render("error", { err });
});

app.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`);
});
