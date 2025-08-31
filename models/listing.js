const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require("./review.js")

const listingSchema = new Schema({
  title: String,
  description: String,
  price: Number,
  location: String,
  country: String,
  image: {
    url: {
      type: String,
      default: "https://www.shutterstock.com/image-photo/iconic-picture-bavaria-maria-gern-600nw-1549897160.jpg"
    },
    filename: {
      type: String,
      default: "default.jpg"
    }
  },
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: "Review"
  }],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  
  

});

listingSchema.pre("save", function (next) {
  if (!this.image || !this.image.url) {
    this.image = {
      url: "https://www.shutterstock.com/image-photo/iconic-picture-bavaria-maria-gern-600nw-1549897160.jpg",
      filename: "default.jpg"
    };
  }
  next();
});


// Delete reviews if listing is deleted
listingSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: { $in: doc.reviews },
    });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
