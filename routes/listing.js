const express = require("express");
const router = express.Router();
const multer = require("multer");

const { storage } = require("../utils/cloudinary");
const upload = multer({ storage });

const Listing = require("../models/listing");
const { isLoggedIn, isOwner } = require("../utils/middleware");
const { listingSchema } = require("../utils/schemas");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");

// ================= VALIDATION =================
function validateListing(req, res, next) {
  try {
    console.log("🔍 VALIDATING BODY:", req.body);

    const { error } = listingSchema.validate(req.body);

    if (error) {
      const errMsg = error.details.map((el) => el.message).join(",");
      console.error("❌ VALIDATION ERROR:", errMsg);
      throw new ExpressError(400, errMsg);
    }

    next();
  } catch (err) {
    console.error("🔥 VALIDATION CRASH:", err);
    next(err);
  }
}

// ================= ROUTES =================

// ✅ INDEX
router.get("/", wrapAsync(async (req, res) => {
  const listings = await Listing.find({});
  res.render("listings/index", { listings });
}));

// ✅ NEW
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new");
});

// ✅ EDIT (🔥 ADDED FIX)
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);
    if (!listing) {
      throw new ExpressError(404, "Listing Not Found");
    }

    res.render("listings/edit", { listing });
  })
);

// ✅ SHOW (⚠️ MUST COME AFTER EDIT)
router.get("/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id)
    .populate("owner")
    .populate({
      path: "reviews",
      populate: { path: "author" },
    });

  if (!listing) {
    throw new ExpressError(404, "Listing Not Found");
  }

  res.render("listings/show", { listing });
}));

// ✅ CREATE
router.post(
  "/",
  isLoggedIn,
  upload.single("image"),

  (req, res, next) => {
    console.log("📦 BODY RECEIVED:", req.body);
    console.log("🖼 FILE RECEIVED:", req.file);
    next();
  },

  validateListing,

  wrapAsync(async (req, res, next) => {
    try {
      let newListing = new Listing(req.body.listing);
      newListing.owner = req.user._id;

      if (req.file && req.file.path) {
        newListing.image = {
          url: req.file.path,
          filename: req.file.filename,
        };
      }

      await newListing.save();

      req.flash("success", "Successfully created a new listing!");
      res.redirect("/listings");

    } catch (err) {
      console.error("🔥 CREATE ERROR:", err);
      next(err);
    }
  })
);

// ✅ UPDATE
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  upload.single("image"),

  (req, res, next) => {
    console.log("📝 UPDATE BODY:", req.body);
    console.log("🖼 UPDATE FILE:", req.file);
    next();
  },

  validateListing,

  wrapAsync(async (req, res, next) => {
    try {
      const { id } = req.params;

      const listing = await Listing.findById(id);
      if (!listing) {
        throw new ExpressError(404, "Listing Not Found");
      }

      listing.set(req.body.listing);

      if (req.file && req.file.path) {
        listing.image = {
          url: req.file.path,
          filename: req.file.filename,
        };
      }

      await listing.save();

      console.log("✅ UPDATED:", listing);

      req.flash("success", "Listing updated successfully!");
      res.redirect(`/listings/${id}`);

    } catch (err) {
      console.error("🔥 UPDATE ERROR:", err);
      next(err);
    }
  })
);

// ✅ DELETE
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res, next) => {
    try {
      const { id } = req.params;

      await Listing.findByIdAndDelete(id);

      req.flash("success", "Listing deleted!");
      res.redirect("/listings");

    } catch (err) {
      console.error("🔥 DELETE ERROR:", err);
      next(err);
    }
  })
);

module.exports = router;