const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/Signup");

router.get("/signup", (req, res) => {
  res.render("signup", { success: req.query.success });
});

router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, phone, password, confirmPassword } = req.body;

    // 1. Check passwords match
    if (!password || !confirmPassword) {
      return res.render("signup", { error: "Password fields are required." });
    }
    if (password !== confirmPassword) {
      return res.render("signup", { error: "Passwords do not match." });
    }
    if (password.length < 8) {
      return res.render("signup", { error: "Password must be at least 8 characters." });
    }

    // 2. Validate phone (Ugandan number)
    const phoneRegex = /^(\+256|0)(7\d{8}|4[0-5]\d{7})$/;
    const phoneNormalized = (phone || '').toString().replace(/\s/g, '');
    if (!phoneNormalized) {
      return res.render("signup", { error: "Phone number is required." });
    }
    if (!phoneRegex.test(phoneNormalized)) {
      return res.render("signup", { error: "Enter a valid Ugandan phone number." });
    }

    // 3. Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.render("signup", { error: "Email already registered." });
    }

    // 4. Register user (passport-local-mongoose handles hashing)
    const newUser = new User({
      fullName,
      email: email.toLowerCase(),
      phone,
    });

    await User.register(newUser, password);
    res.redirect("/login");

  } catch (error) {
    console.error(error);
    res.render("signup", { error: error.message });
  }
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", passport.authenticate("local", {
  failureRedirect: "/login",
}), (req, res) => {
  return res.redirect("/success");
});

router.get("/success", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }
  res.render("success");
});

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/signup");
  });
});

module.exports = router;