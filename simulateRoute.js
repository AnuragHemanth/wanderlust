const mongoose = require("mongoose");
const Listing = require("./models/listing");
const User = require("./models/user");

async function simulateRoute() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
    
    console.log("\n=== SIMULATING INDEX ROUTE ===\n");
    
    // Simulate the INDEX route
    const allListings = await Listing.find({}).populate("owner");
    
    console.log(`Found ${allListings.length} listings\n`);
    
    // Check the first 3
    for (let i = 0; i < 3; i++) {
      const listing = allListings[i];
      console.log(`Listing ${i + 1}: ${listing.title}`);
      console.log(`  - listing.owner exists: ${!!listing.owner}`);
      console.log(`  - listing.owner value: ${JSON.stringify(listing.owner)}`);
      console.log(`  - listing.owner.username: ${listing.owner ? listing.owner.username : "NOT FOUND"}`);
      console.log();
    }
    
    console.log("\n=== SIMULATING SHOW ROUTE ===\n");
    
    // Simulate the SHOW route
    const singleListing = await Listing.findById(allListings[0]._id)
      .populate({ path: "reviews", populate: "author" })
      .populate("owner");
    
    console.log(`Listing: ${singleListing.title}`);
    console.log(`  - listing.owner exists: ${!!singleListing.owner}`);
    console.log(`  - listing.owner.username: ${singleListing.owner ? singleListing.owner.username : "NOT FOUND"}`);
    
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

simulateRoute();
