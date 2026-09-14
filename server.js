// ==========================================
// Smart Campus Hub - Backend Server
// ==========================================

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

// ==========================================
// Import Routes
// ==========================================

const complaintRoutes = require("./routes/complaintRoutes");
const lostFoundRoutes = require("./routes/lostFoundRoutes");
const userRoutes = require("./routes/userRoutes");
const aiRoutes = require("./routes/aiRoutes");

console.log("All routes imported successfully");

// ==========================================
// Create Express App
// ==========================================

const app = express();

// ==========================================
// Middlewares
// ==========================================

// Allow frontend requests
app.use(cors());

// Read JSON data
app.use(express.json());

// Read form data
app.use(express.urlencoded({ extended: true }));

// ==========================================
// Static Uploads Folder
// ==========================================

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// ==========================================
// MongoDB Connection
// ==========================================

console.log("MONGO URI LOADED:", !!process.env.MONGO_URI);

mongoose
  .connect(
    process.env.MONGO_URI ||
      "mongodb://localhost:27017/smartcampus"
  )
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((error) => {
    console.error("MongoDB Error:", error.message);
  });

// ==========================================
// API Routes
// ==========================================

// User routes
app.use("/api/users", userRoutes);

// Complaint routes
app.use("/api/complaints", complaintRoutes);

// Lost & Found routes
app.use("/api/lostfound", lostFoundRoutes);

// AI Assistant routes
app.use("/api/ai", aiRoutes);

// ==========================================
// Test Route
// ==========================================

app.get("/", (req, res) => {
  res.status(200).send("Smart Campus Backend Running");
});

// ==========================================
// 404 Route
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

// ==========================================
// Global Error Handler
// ==========================================

app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// ==========================================
// Start Server
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});