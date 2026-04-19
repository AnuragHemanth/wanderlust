const express = require("express");
const router = express.Router({ mergeParams: true });
const { reviewSchema } = require("../utils/schemas");

// 🔥 Middleware
const { isLoggedIn, isReviewAuthor } = require("../utils/middleware");

// 🔥 Error utils
const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");

// 🔥 Controller
const reviewController = require("../controllers/reviewController");

// Validation middleware
function validateReview(req, res, next) {
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    const errMsg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
}

// CREATE REVIEW
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

// DELETE REVIEW
router.delete("/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.deleteReview)
);

module.exports = router;