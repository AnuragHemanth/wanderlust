const mongoose = require("mongoose");
const Listing = require("./models/listing");
const User = require("./models/user");

async function migrateListings() {
  try {
    // Connect to database
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
    console.log("Connected to database");

    // Find or create the Anurag user
    let anuragUser = await User.findOne({ username: "anurag" });
    if (!anuragUser) {
      console.log("Creating user: anurag");
      anuragUser = new User({ username: "anurag", email: "anurag@wanderlust.com" });
      await User.register(anuragUser, "anurag123");
      console.log("User anurag created successfully");
    } else {
      console.log("User anurag already exists");
    }

    // Update ALL listings to have anurag as owner
    const result = await Listing.updateMany(
      {},
      { $set: { owner: anuragUser._id } }
    );

    console.log(`Updated ${result.modifiedCount} listings to have owner: ${anuragUser.username}`);

    // Close connection
    await mongoose.connection.close();
    console.log("Migration completed successfully");

  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrateListings();