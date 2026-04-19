const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError");

module.exports.createReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);

  if (!listing) {
    throw new ExpressError(404, "Listing Not Found");
  }

  let newReview = new Review({ ...req.body.review, author: req.user._id });
  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

  res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview = async (req, res) => {
  let { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  res.redirect(`/listings/${id}`);
};