const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');
const ExpressErrors = require("../utils/ExpressErrors.js");
const { listingSchema } = require("../listingSchema.js");

// Middleware: validate listing
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressErrors(400, msg);
    }
    next();
};

// Index
router.get('/', async (req, res, next) => {
    try {
        const allListings = await Listing.find({});
        res.render('listings/index', { listings: allListings });
    } catch (err) {
        next(err);
    }
});

// New
router.get('/new', (req, res) => {
    res.render('listings/new');
});

// Show
router.get("/:id", async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate("reviews");
    if (!listing) throw new ExpressErrors(404, "Listing not found");
    res.render("listings/show", { listing });
  } catch (err) {
    next(err);
  }
});



// Create
router.post('/', validateListing, async (req, res, next) => {
    try {
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect('/listings');
    } catch (err) {
        next(err);
    }
});

// Edit
router.get('/:id/edit', async (req, res, next) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) throw new ExpressErrors(404, "Listing not found");
        res.render('listings/edit', { listing });
    } catch (err) {
        next(err);
    }
});

// Update
router.put('/:id', validateListing, async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedListing = await Listing.findByIdAndUpdate(
            id,
            req.body.listing,
            { new: true, runValidators: true }
        );
        if (!updatedListing) throw new ExpressErrors(404, "Listing not found");
        res.redirect(`/listings/${updatedListing._id}`);
    } catch (err) {
        next(err);
    }
});

// Delete
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        await Listing.findByIdAndDelete(id);
        res.redirect('/listings');
    } catch (err) {
        next(err);
    }
});

module.exports = router;
