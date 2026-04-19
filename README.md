# Wanderlust

A full-stack web application for travel listings and reviews, built with Node.js, Express, MongoDB, and EJS.

## Architecture

This application follows the **MVC (Model-View-Controller)** architectural pattern for better code organization and maintainability.

### 📁 Project Structure

```
wanderlust/
├── controllers/          # Controller layer - handles business logic
│   ├── authController.js     # Authentication logic
│   ├── listingController.js  # Listing CRUD operations
│   └── reviewController.js   # Review CRUD operations
├── models/              # Model layer - data structures and database schemas
│   ├── listing.js           # Listing schema
│   ├── review.js            # Review schema
│   └── user.js              # User schema
├── routes/              # Routing layer - defines API endpoints
│   ├── auth.js              # Authentication routes
│   ├── listing.js           # Listing routes
│   └── review.js            # Review routes
├── views/               # View layer - EJS templates
│   ├── listings/            # Listing-related views
│   ├── login.ejs            # Login page
│   ├── register.ejs         # Registration page
│   └── ...
├── utils/               # Utility functions and middleware
├── public/              # Static assets (CSS, JS, images)
├── app.js               # Main application file
└── package.json         # Dependencies and scripts
```

### 🏗️ MVC Pattern Implementation

#### **Models** (`/models/`)
- Define data structures and database schemas using Mongoose
- Handle data validation and relationships
- Example: `listing.js`, `review.js`, `user.js`

#### **Views** (`/views/`)
- EJS templates for rendering HTML
- Handle presentation logic
- Organized by feature (listings, auth, etc.)

#### **Controllers** (`/controllers/`)
- Contain business logic and request handling
- Process data from models and pass to views
- Handle HTTP requests and responses
- Examples:
  - `listingController.js`: CRUD operations for listings
  - `authController.js`: User authentication logic
  - `reviewController.js`: Review management

#### **Routes** (`/routes/`)
- Define URL endpoints and HTTP methods
- Apply middleware (authentication, validation)
- Delegate to appropriate controller methods
- Keep routing logic separate from business logic

### 🔧 Key Features

- **User Authentication**: Secure login/registration with Passport.js
- **Listing Management**: Create, read, update, delete travel listings
- **Interactive Star Rating System**: Users can select ratings using an attractive 5-star interactive rating widget
- **Visual Rating Display**: Reviews display ratings using beautiful star graphics instead of plain numbers
- **Secure Review Management**: Only authenticated users can add reviews, only authors can delete their reviews
- **Real-time Form Validation**: Client-side validation ensures ratings and comments meet requirements
- **Responsive Design**: Mobile-friendly interface
- **Flash Messages**: User feedback for actions
- **Session Management**: Secure session handling

### 🚀 Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up MongoDB connection in `app.js`

3. Start the development server:
   ```bash
   npm start
   ```

4. Visit `http://localhost:3000`

### 📋 API Endpoints

#### Authentication
- `GET /login` - Login page
- `POST /login` - Authenticate user
- `GET /register` - Registration page
- `POST /register` - Create new user
- `POST /logout` - Logout user

#### Listings
- `GET /listings` - View all listings
- `GET /listings/new` - New listing form (authenticated)
- `POST /listings` - Create listing (authenticated)
- `GET /listings/:id` - View specific listing
- `GET /listings/:id/edit` - Edit listing form (owner only)
- `PUT /listings/:id` - Update listing (owner only)
- `DELETE /listings/:id` - Delete listing (owner only)

#### Reviews
- `POST /listings/:id/reviews` - Add review (authenticated)
- `DELETE /listings/:id/reviews/:reviewId` - Delete review (author only)

### 🔒 Security Features

- **Authentication Required**: All write operations require login
- **Authorization Checks**: Users can only modify their own content
- **Input Validation**: Joi schemas validate all user input
- **API Protection**: Proper HTTP status codes for unauthorized requests
- **Session Security**: Secure session configuration with MongoDB store

### 📸 Image Upload Features

- **Cloudinary Integration**: Images are stored securely in the cloud
- **File Upload Support**: Users can upload images directly or provide URLs
- **Image Management**: Automatic cleanup of old images when updated or deleted
- **Multiple Upload Options**: Support for both file uploads and URL inputs
- **API Access**: Programmatic access to Cloudinary resources

#### Fetching Images from Cloudinary

##### Method 1: Direct URL Access (Current Implementation)
Images are stored in your database and accessed directly via URLs:
```javascript
// In your EJS templates
<img src="<%= listing.image.url %>" alt="Listing image">
```

##### Method 2: Cloudinary API (Programmatic Access)
Use the Cloudinary API to fetch images programmatically:

```javascript
// Fetch all images from your folder
const result = await cloudinary.api.resources({
  type: 'upload',
  prefix: 'wanderlust_DEV/',
  max_results: 100
});

// Get specific image details
const image = await cloudinary.api.resource('wanderlust_DEV/image_public_id');

// Generate transformed URLs
const thumbnail = cloudinary.url('wanderlust_DEV/image_public_id', {
  width: 200, height: 200, crop: 'fill'
});
```

##### Method 3: API Routes (Available in App)
Your app includes API routes for Cloudinary operations:

```javascript
// GET /api/cloudinary/images - Fetch all images
// GET /api/cloudinary/images/:publicId - Get image details
// GET /api/cloudinary/images/:publicId/urls - Get transformed URLs
```

##### Method 4: Test Script
Run the test script to see Cloudinary API in action:
```bash
node test-cloudinary.js
```
- **Secure Storage**: Images are stored with unique filenames for security

### 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL=mongodb://localhost:27017/wanderlust

# Session
SECRET=your-secret-key-here

# Cloudinary Configuration (for image uploads)
CLOUD_NAME=your-cloudinary-cloud-name
API_KEY=your-cloudinary-api-key
API_SECRET=your-cloudinary-api-secret
```

### 📦 Dependencies

#### Core Dependencies
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `ejs` - Template engine
- `passport` - Authentication
- `passport-local` - Local authentication strategy
- `express-session` - Session management
- `connect-mongo` - MongoDB session store
- `joi` - Input validation
- `connect-flash` - Flash messages
- `method-override` - HTTP method override

#### Image Upload Dependencies
- `multer` - File upload middleware
- `cloudinary` - Cloud storage service
- `multer-storage-cloudinary` - Cloudinary storage for Multer
- `dotenv` - Environment variable management

#### Development Dependencies
- `nodemon` - Development server auto-restart