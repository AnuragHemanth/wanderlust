const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({}).populate("owner");
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  const listing = await Listing.findById(req.params.id)
    .populate({ path: "reviews", populate: "author" })
    .populate("owner");

  if (!listing) {
    throw new ExpressError(404, "Listing Not Found");
  }

  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
  let url = "https://via.placeholder.com/400";
  let filename = "default";

  if (req.body.listing.imageUrl && req.body.listing.imageUrl.trim() !== "") {
    // Use provided URL
    url = req.body.listing.imageUrl;
    filename = "default"; // Keep default filename for URL-based images
  } else if (req.file) {
    // Use uploaded file
    url = req.file.path;
    filename = req.file.filename;
  }

  const newListing = new Listing({
    ...req.body.listing,
    owner: req.user._id,
    image: {
      url: url,
      filename: filename
    }
  });

  await newListing.save();
  req.flash("success", "Listing created successfully!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    throw new ExpressError(404, "Listing Not Found");
  }

  res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let updatedData = req.body.listing;

  const listing = await Listing.findById(id);

  if (req.body.listing.imageUrl && req.body.listing.imageUrl.trim() !== "") {
    // Delete old image from Cloudinary if it exists and is not the default
    if (listing.image && listing.image.filename && listing.image.filename !== "default") {
      await cloudinary.uploader.destroy(listing.image.filename);
    }

    // Set new image data from URL
    updatedData.image = { url: req.body.listing.imageUrl };
  } else if (req.file) {
    // Delete old image from Cloudinary if it exists and is not the default
    if (listing.image && listing.image.filename && listing.image.filename !== "default") {
      await cloudinary.uploader.destroy(listing.image.filename);
    }

    // Set new image data from file upload
    updatedData.image = {
      url: req.file.path,
      filename: req.file.filename
    };
  } else if (!updatedData.image || updatedData.image.trim() === "") {
    updatedData.image = listing.image;
  } else {
    updatedData.image = { url: updatedData.image };
  }

  // Set owner if not already set (for existing listings)
  if (!listing.owner) {
    updatedData.owner = req.user._id;
  }

  await Listing.findByIdAndUpdate(id, updatedData);

  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);

  if (!deletedListing) {
    throw new ExpressError(404, "Listing Not Found");
  }

  // Delete image from Cloudinary if it exists and is not the default
  if (deletedListing.image && deletedListing.image.filename && deletedListing.image.filename !== "default") {
    await cloudinary.uploader.destroy(deletedListing.image.filename);
  }

  // Delete all associated reviews
  await Review.deleteMany({ _id: { $in: deletedListing.reviews } });

  req.flash("success", "Listing deleted successfully!");
  res.redirect("/listings");
};