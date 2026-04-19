```js
const passport = require("passport");
const User = require("../models/user");
const LocalStrategy = require("passport-local");

// ================= RENDER PAGES =================
module.exports.renderLogin = (req, res) => {
  res.render("login", { returnTo: req.session.returnTo });
};

module.exports.renderRegister = (req, res) => {
  res.render("register", { returnTo: req.session.returnTo });
};

// ================= REGISTER =================
module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // 🔥 Validation (important)
    if (!username || username.trim() === "") {
      req.flash("error", "Username is required");
      return res.redirect("/register");
    }

    const user = new User({ username, email });

    const registeredUser = await User.register(user, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);

      req.flash("success", "Welcome to Wanderlust!");

      const redirectUrl = req.session.returnTo || "/listings";
      delete req.session.returnTo;

      res.redirect(redirectUrl);
    });

  } catch (err) {
    console.log("REGISTER ERROR:", err);
    req.flash("error", err.message);
    res.redirect("/register");
  }
};

// ================= LOGIN =================
module.exports.login = [
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "Welcome back!");

    const redirectUrl = req.session.returnTo || "/listings";
    delete req.session.returnTo;

    res.redirect(redirectUrl);
  }
];

// ================= LOGOUT =================
module.exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);

    req.flash("success", "Goodbye!");
    res.redirect("/listings");
  });
};

// ================= DEBUG =================
module.exports.debugLogin = (req, res, next) => {
  console.log("req.user:", req.user);
  console.log("req.session:", req.session);
  next();
};

// ================= PASSPORT STRATEGY =================
// 🔥 IMPORTANT: use default strategy (DO NOT customize)
passport.use(new LocalStrategy(User.authenticate()));
```
