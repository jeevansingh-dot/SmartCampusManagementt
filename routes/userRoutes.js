const express = require("express");

console.log("USER ROUTES LOADED");

const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user");

// =========================
// SIGNUP - STUDENT
// =========================
router.post("/signup", async (req, res) => {
  try {
    const {
      erpId,
      name,
      email,
      password
    } = req.body;

    // Check required fields
    if (!erpId || !name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Check existing user
    const existingUser = await User.findOne({
      erpId: erpId.trim().toUpperCase()
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this ERP ID already exists"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // Create student
    const newUser = new User({
      erpId: erpId.trim().toUpperCase(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,

      // Normal signup = student
      role: "student"
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message:
        "Account created successfully. Please login."
    });

  } catch (error) {
    console.error("Signup Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during signup"
    });
  }
});


// =========================
// LOGIN - STUDENT / ADMIN
// =========================
router.post("/login", async (req, res) => {
  try {
    const {
      erpId,
      password
    } = req.body;

    // Check fields
    if (!erpId || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Provide ERP ID and Password"
      });
    }

    // Find user
  // Find user
const user = await User.findOne({
  erpId: erpId.trim().toUpperCase()
});

console.log("LOGIN ERP:", erpId.trim().toUpperCase());
console.log("USER FOUND:", !!user);

if (!user) {
  return res.status(401).json({
    success: false,
    message: "Invalid ERP ID or Password"
  });
}

// Compare password
const isMatch = await bcrypt.compare(
  password,
  user.password
);

console.log("PASSWORD MATCH:", isMatch);

if (!isMatch) {
  return res.status(401).json({
    success: false,
    message: "Invalid ERP ID or Password"
  });
}

    // Successful login
    return res.json({
      success: true,
      message: "Login successful",

      user: {
        erpId: user.erpId,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message:
        "Server error during login"
    });
  }
});


// =========================
// CREATE ADMIN
// =========================
// Temporary setup route.
// Later we will secure/remove this route.
router.post("/create-admin", async (req, res) => {
  try {
    const {
      erpId,
      name,
      email,
      password
    } = req.body;

    // Check fields
    if (!erpId || !name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Check existing user
    const existingUser = await User.findOne({
      erpId: erpId.trim().toUpperCase()
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "User with this ERP ID already exists"
      });
    }

    // Hash password
    const hashedPassword =
      await bcrypt.hash(password, 10);

    // Create admin
    const admin = new User({
      erpId: erpId.trim().toUpperCase(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,

      // Admin role
      role: "admin"
    });

    await admin.save();

    return res.status(201).json({
      success: true,
      message:
        "Admin account created successfully"
    });

  } catch (error) {
    console.error(
      "Create Admin Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while creating admin"
    });
  }
});


// =========================
// EXPORT ROUTER
// =========================
module.exports = router;