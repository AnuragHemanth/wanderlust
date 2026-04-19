const Listing = require("../models/listing");
const Review = require("../models/review");
const ExpressError = require("./ExpressError");

module.exports.isLoggedIn = (req, res, next) => {
  console.log("isLoggedIn middleware triggered");
  if (req.isAuthenticated()) {
    return next();
  }

  // Check if this is an API request
  const isApiRequest = req.headers.accept && req.headers.accept.includes('application/json');

  if (isApiRequest) {
    return res.status(401).json({
      success: false,
      message: "Authentication required. Please log in to access this resource."
    });
  }

  // Store the original URL in session before redirecting to login
  req.session.returnTo = req.originalUrl;
  req.flash("error", "You must be signed in first!");
  res.redirect("/login");
};

module.exports.isOwner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    console.log("isOwner middleware triggered for listing ID:", id);
    if (!listing) {
      throw new ExpressError(404, "Listing Not Found");
    }
    if (!listing.owner || !listing.owner.equals(req.user._id)) {
      const isApiRequest = req.headers.accept && req.headers.accept.includes('application/json');
      if (isApiRequest) {
        return res.status(403).json({
          success: false,
          message: "Forbidden. You do not have permission to perform this action."
        });
      }
      req.flash("error", "You do not have permission to do that");
      return res.redirect(`/listings/${id}`);
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  try {
    const { reviewId, id } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) {
      throw new ExpressError(404, "Review Not Found");
    }
    if (!review.author || !review.author.equals(req.user._id)) {
      const isApiRequest = req.headers.accept && req.headers.accept.includes('application/json');
      if (isApiRequest) {
        return res.status(403).json({
          success: false,
          message: "Forbidden. You can only modify your own reviews."
        });
      }
      req.flash("error", "You do not have permission to do that");
      return res.redirect(`/listings/${id}`);
    }
    next();
  } catch (err) {
    next(err);
  }
};
