const express = require("express");
const router = express.Router();

// Middleware to store the original URL
router.use((req, res, next) => {
  if (!req.isAuthenticated() && req.method === "GET" && !req.path.startsWith("/login") && !req.path.startsWith("/register")) {
    req.session.returnTo = req.originalUrl;
  }
  next();
});

// 🔥 Controller
const authController = require("../controllers/authController");

router.get("/login", authController.renderLogin);

router.get("/register", authController.renderRegister);

router.post("/register", authController.register);

const { debugLogin } = require("../controllers/authController");

router.post("/login", debugLogin, authController.login);

router.post("/logout", authController.logout);

module.exports = router;
