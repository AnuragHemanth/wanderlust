
require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const MongoStore = require("connect-mongo").default;

const passport = require("passport");
const LocalStrategy = require("passport-local");

// ROUTES
const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const authRouter = require("./routes/auth");

const User = require("./models/user");
const ExpressError = require("./utils/ExpressError");

// ================= DATABASE =================
const MONGO_URL = process.env.ATLAS_DB_URL;
const SECRET = process.env.SECRET || "mysupersecretstring";

mongoose.connect(MONGO_URL)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ================= VIEW ENGINE =================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ================= MIDDLEWARE =================
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// ================= SESSION STORE =================
const store = MongoStore.create({
  mongoUrl: MONGO_URL,
  crypto: {
    secret: SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.error("❌ SESSION STORE ERROR:", err);
});

const isProduction = process.env.NODE_ENV === "production";

const sessionOptions = {
  store,
  secret: SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,   // 🔥 FIX
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionOptions));

// 🔥 IMPORTANT FIX (flash must come after session)
app.use(flash());

// ================= PASSPORT =================
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ================= GLOBAL VARIABLES =================
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

// ================= ROUTES =================
app.use("/", authRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/listings", listingRouter);

// ================= ROOT =================
app.get("/", (req, res) => {
  res.redirect("/listings");
});

// ================= ERROR HANDLING =================
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  console.error("💥 GLOBAL ERROR:", err);
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error", { message });
});

// ================= SERVER =================
if (isProduction) {
  app.set("trust proxy", 1);
  console.log("🚀 Running in production mode");
} else {
  console.log("⚠️ Running in development mode");
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

