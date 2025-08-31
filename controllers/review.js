const Review = require("../models/review.js");
const ExpressErrors = require("../utils/ExpressErrors.js");
const Listing = require("../models/listing.js");

module.exports.createReview=async (req, res, next) => {
  try {
    let listing = await Listing.findById(req.params.id);
    if (!listing) throw new ExpressErrors(404, "Listing not found");

    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    console.log(newReview);

    await newReview.save();
    await listing.save();
    req.flash('success', 'Successfully posted a new review!');
    res.redirect(`/listings/${listing._id}`);
  } catch (err) {
    next(err);
  }
}

module.exports.deleteReview=async (req, res, next) => {
  try {
    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!');
    res.redirect(`/listings/${id}`);
  } catch (err) {
    next(err);
  }
}