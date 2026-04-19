const mongoose = require("mongoose");
const Listing = require("./models/listing");
const User = require("./models/user");

async function testOwnerPopulation() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
    
    // Get a single listing with owner populated
    const listing = await Listing.findOne({}).populate("owner");
    
    console.log("\n=== SINGLE LISTING TEST ===\n");
    console.log("Listing Title:", listing.title);
    console.log("Owner Object:", listing.owner);
    console.log("Owner Username:", listing.owner ? listing.owner.username : "null");
    
    // Get multiple listings to check
    const listings = await Listing.find({}).populate("owner").limit(3);
    
    console.log("\n=== FIRST 3 LISTINGS ===\n");
    listings.forEach((l, i) => {
      console.log(`${i + 1}. ${l.title}`);
      console.log(`   - Owner ID: ${l.owner ? l.owner._id : "null"}`);
      console.log(`   - Owner Username: ${l.owner ? l.owner.username : "null"}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

testOwnerPopulation();
