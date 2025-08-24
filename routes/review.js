const express = require('express');
const router = express.Router({ mergeParams: true }); 
const { reviewSchema } = require("../listingSchema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const ExpressErrors = require("../utils/ExpressErrors.js");

// Middleware: validate review
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressErrors(400, msg);
  }
  next();
};

// Post review
router.post("/", validateReview, async (req, res, next) => {
  try {
    let listing = await Listing.findById(req.params.id);
    if (!listing) throw new ExpressErrors(404, "Listing not found");

    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
  } catch (err) {
    next(err);
  }
});

// Delete review
router.delete("/:reviewId", async (req, res, next) => {
  try {
    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
