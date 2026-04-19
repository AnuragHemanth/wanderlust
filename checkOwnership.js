const mongoose = require("mongoose");
const Listing = require("./models/listing");
const User = require("./models/user");

async function checkOwnership() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
    
    const listings = await Listing.find({}).populate("owner");
    const owners = {};
    
    listings.forEach(listing => {
      const owner = listing.owner ? listing.owner.username : "No Owner";
      owners[owner] = (owners[owner] || 0) + 1;
    });
    
    console.log("\n=== PROPERTY OWNERSHIP SUMMARY ===\n");
    Object.entries(owners).forEach(([owner, count]) => {
      console.log(`Owner: ${owner} | Properties: ${count}`);
    });
    console.log(`\nTotal Properties: ${listings.length}\n`);
    
    // Show some sample properties
    console.log("=== SAMPLE PROPERTIES ===\n");
    listings.slice(0, 5).forEach(listing => {
      console.log(`- ${listing.title} | Owner: ${listing.owner ? listing.owner.username : "Unknown"}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

checkOwnership();
