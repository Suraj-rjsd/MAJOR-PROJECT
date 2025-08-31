const Listing = require('../models/listing');
const ExpressErrors = require("../utils/ExpressErrors");
const axios = require("axios");

module.exports.index = async (req, res, next) => {
    try {
        const allListings = await Listing.find({});
        res.render('listings/index', { listings: allListings });
    } catch (err) {
        next(err);
    }
}
module.exports.new = (req, res) => {
    res.render('listings/new');
};
module.exports.show = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id).populate({ path: "reviews", populate: "author" }).populate("owner");
        if (!listing) throw new ExpressErrors(404, "Listing not found");
        console.log(listing);
        res.render("listings/show", { listing });
    } catch (err) {
        next(err);
    }
}


module.exports.create = async (req, res, next) => {
  try {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    


    // Handle image upload if present
    if (req.file) {
      newListing.image = { url: req.file.path, filename: req.file.filename };
    }

    await newListing.save();
    req.flash("success", "Successfully created a new listing!");
    res.redirect(`/listings/${newListing._id}`);
  } catch (err) {
    next(err);
  }
};

module.exports.edit = async (req, res, next) => {

    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) throw new ExpressErrors(404, "Listing not found");

  

    res.render('listings/edit', { listing });

}

module.exports.update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedListing = await Listing.findByIdAndUpdate(
            id,
            req.body.listing,
            { new: true, runValidators: true }

        );
        if (req.file) {
            let url = req.file.path;
            let filename = req.file.filename;
            updatedListing.image = { url, filename };
            await updatedListing.save();
        }

        if (!updatedListing) throw new ExpressErrors(404, "Listing not found");
        req.flash('success', 'Successfully updated listing!');
        res.redirect(`/listings/${updatedListing._id}`);
    } catch (err) {
        next(err);
    }
}

module.exports.delete = async (req, res, next) => {
    try {
        const { id } = req.params;
        await Listing.findByIdAndDelete(id);
        req.flash('success', 'Successfully deleted listing!');
        res.redirect('/listings');
    } catch (err) {
        next(err);
    }
}