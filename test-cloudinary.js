// Test script to demonstrate Cloudinary image fetching
// Run with: node test-cloudinary.js

require('dotenv').config();
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

async function testCloudinaryAPI() {
  console.log('🧪 Testing Cloudinary API...\n');

  try {
    // 1. Fetch all images from wanderlust_DEV folder
    console.log('1️⃣ Fetching all images from wanderlust_DEV folder:');
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'wanderlust_DEV/',
      max_results: 10
    });

    console.log(`Found ${result.resources.length} images:`);
    result.resources.forEach((img, index) => {
      console.log(`${index + 1}. ${img.public_id} - ${img.url}`);
    });

    // 2. Get details of first image
    if (result.resources.length > 0) {
      const firstImage = result.resources[0];
      console.log('\n2️⃣ Getting details of first image:');
      const imageDetails = await cloudinary.api.resource(firstImage.public_id);
      console.log('Image Details:', {
        public_id: imageDetails.public_id,
        format: imageDetails.format,
        width: imageDetails.width,
        height: imageDetails.height,
        bytes: imageDetails.bytes,
        created_at: imageDetails.created_at
      });

      // 3. Generate different sized URLs
      console.log('\n3️⃣ Generated URLs for different sizes:');
      const urls = {
        original: cloudinary.url(firstImage.public_id),
        thumbnail: cloudinary.url(firstImage.public_id, {
          width: 200, height: 200, crop: 'fill'
        }),
        medium: cloudinary.url(firstImage.public_id, {
          width: 500, height: 300, crop: 'scale'
        }),
        large: cloudinary.url(firstImage.public_id, {
          width: 1200, height: 800, crop: 'scale'
        })
      };

      Object.entries(urls).forEach(([size, url]) => {
        console.log(`${size}: ${url}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error?.message || 'Unknown error');
    if (error?.message?.includes('Missing required parameter') || !process.env.CLOUD_NAME) {
      console.log('\n💡 Make sure your .env file has valid Cloudinary credentials:');
      console.log('CLOUD_NAME=your-cloud-name');
      console.log('API_KEY=your-api-key');
      console.log('API_SECRET=your-api-secret');
      console.log('\n🔗 Get your credentials from: https://cloudinary.com/console');
    }
  }
}

// Run the test
testCloudinaryAPI();