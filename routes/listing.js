const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');
const ExpressErrors = require("../utils/ExpressErrors.js");
const { isSignedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");

const { storage } = require("../cloudConfig.js");
const multer = require('multer');
const upload = multer({ storage });




// Index
router.get('/', listingController.index);

// New 
router.get('/new', isSignedIn, listingController.new);

// Show
router.get("/:id", listingController.show);

// Create 
router.post('/', isSignedIn,upload.single('listing[image][url]'), validateListing,  listingController.create);

// Edit 
router.get('/:id/edit', isSignedIn, isOwner, listingController.edit);

// Update
router.put('/:id', isSignedIn, isOwner,upload.single('listing[image][url]'), validateListing, listingController.update);

// Delete
router.delete('/:id', isSignedIn, isOwner,);

module.exports = router;
