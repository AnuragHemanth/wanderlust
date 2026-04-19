const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required."],
  },

  description: {
    type: String,
    required: [true, "Description is required."],
  },

  price: {
    type: Number,
    required: [true, "Price is required."],
    min: [0, "Price must be a positive number."],
  },

  location: {
    type: String,
    required: [true, "Location is required."],
  },

  country: {
    type: String,
    required: [true, "Country is required."],
  },

  image: {
    url: {
      type: String,
      default: "https://via.placeholder.com/300",
    },
    filename: {
      type: String,
      default: "default",
    },
  },

  // 🔥 ADD THIS (IMPORTANT FIX)
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],

  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;