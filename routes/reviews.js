const express = require("express");
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const Campgound = require("../models/campground");
const Review = require("../models/review");
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");

// route to create review for campground
router.post(
  "/",
  isLoggedIn,
  validateReview,
  catchAsync(async (req, res) => {
    const campground = await Campgound.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Created new review");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// route to delete review for campground
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;

    await Campgound.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted review");
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
