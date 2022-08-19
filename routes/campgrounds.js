const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { campgroundSchema } = require("../schemas.js");
const { isLoggedIn } = require("../middleware");

const ExpressError = require("../utils/ExpressError");
const Campgound = require("../models/campground");

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next(error);
  }
};

// route to get all campgrounds
router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await Campgound.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

// route to show form for adding new campground
router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

// route to post new campground
router.post(
  "/",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res, next) => {
    // if (!req.body.campground) {
    //   throw new ExpressError("Invalid Campground Data", 400);
    // }

    const campground = new Campgound(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash("success", "Successfully made a new campground");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// route for single campground based on id
router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campgound.findById(id)
      .populate("reviews")
      .populate("author");
    if (!campground) {
      req.flash("error", "Unable to locate campground");
      res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
  })
);

// route to serve up form to edit campground
router.get("/:id/edit", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const campground = await Campgound.findById(id);
  if (!campground) {
    req.flash("error", "Unable to locate campground");
    res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
});

// route that updates the campground
router.put(
  "/:id",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campgound.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    req.flash("success", "Successfully updated campground!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// route to delete campground
router.delete(
  "/:id",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campgound.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted campground");
    res.redirect("/campgrounds");
  })
);

module.exports = router;
