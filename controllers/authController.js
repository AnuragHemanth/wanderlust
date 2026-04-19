const passport = require("passport");
const User = require("../models/user");
const LocalStrategy = require("passport-local"); // Import LocalStrategy

module.exports.renderLogin = (req, res) => {
  res.render("login", { returnTo: req.session.returnTo });
};

module.exports.renderRegister = (req, res) => {
  res.render("register", { returnTo: req.session.returnTo });
};

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Wanderlust!");
      // Redirect to the original URL or default to listings
      const redirectUrl = req.session.returnTo || "/listings";
      delete req.session.returnTo; // Clear the stored URL
      res.redirect(redirectUrl);
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/register");
  }
};

module.exports.login = [
  passport.authenticate("local", {
    failureFlash: "Invalid username or password",
    failureRedirect: "/login",
    keepSessionInfo: true,
  }),
  (req, res) => {
    req.flash("success", "Welcome back!");
    // Redirect to the original URL or default to listings
    const redirectUrl = req.session.returnTo || "/listings";
    delete req.session.returnTo; // Clear the stored URL
    res.redirect(redirectUrl);
  }
];

module.exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/listings");
  });
};

module.exports.debugLogin = (req, res, next) => {
  console.log("req.user:", req.user);
  console.log("req.session:", req.session);
  next();
};

passport.use(new LocalStrategy({
  usernameField: "email", // Use email as the username field
  passReqToCallback: true, // Pass request to callback for additional checks
}, async (req, email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return done(null, false, { message: "Email not registered" });
    }
    const isValid = await user.authenticate(password);
    if (!isValid) {
      return done(null, false, { message: "Invalid password" });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));