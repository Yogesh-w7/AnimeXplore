const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const authMiddleware = require("../middleware");

// 📌 Signup route
router.post(
  "/signup",
  [
    body("username").trim().notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Enter a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password should be at least 6 characters long")
      .matches(/\d/)
      .withMessage("Password must contain at least one number"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { username, email, password } = req.body;

      // Check if user exists
      const userExists = await User.findOne({ $or: [{ username }, { email }] });
      if (userExists) {
        return res
          .status(409)
          .json({ message: "Username or email already exists" });
      }

      // Hash password
      const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        role: "user",
      });

      await newUser.save();

      // Automatically log them in by returning a token
      const payload = { userId: newUser._id, role: newUser.role };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY || "24h",
      });

      return res.status(201).json({
        message: "User created successfully",
        token,
        userId: newUser._id,
        role: newUser.role,
      });
    } catch (error) {
      console.error("Signup error:", error.message);
      return res.status(500).json({
        message:
          "An error occurred while creating your account. Please try again later.",
      });
    }
  }
);

// 📌 Login route
router.post("/login", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Find by username or email
    const user = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid username/email or password" });
    }

    // Compare password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res
        .status(401)
        .json({ message: "Invalid username/email or password" });
    }

    // JWT payload
    const payload = { userId: user._id, role: user.role };

    // Sign token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY || "24h",
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      userId: user._id,
      role: user.role,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
});

// 📌 Protected route: Profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    // Fix: middleware sets req.userData
    const user = await User.findById(req.userData.userId).select(
      "username email role"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(user);
  } catch (error) {
    console.error("Profile error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
