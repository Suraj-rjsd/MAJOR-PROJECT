const express = require('express');
const router = express.Router({ mergeParams: true });
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const ExpressErrors = require("../utils/ExpressErrors.js");
const { validateReview } = require("../middleware.js");
const { isSignedIn,isAuthor } = require("../middleware.js");
const reviewController = require("../controllers/review.js");



// Post review
router.post("/", isSignedIn,validateReview, reviewController.createReview);

// Delete review
router.delete("/:reviewId",isSignedIn,isAuthor, reviewController.deleteReview);

module.exports = router;
