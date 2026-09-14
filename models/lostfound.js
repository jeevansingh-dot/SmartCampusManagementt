const mongoose = require("mongoose");

const lostFoundSchema = new mongoose.Schema(
  {
    // Student Details
    studentName: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
    },

    erpId: {
      type: String,
      required: [true, "ERP ID is required"],
      trim: true,
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },

    course: {
      type: String,
      required: [true, "Course is required"],
      trim: true,
    },

    // Lost & Found Details
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },

    type: {
      type: String,
      enum: ["Lost", "Found"],
      required: [true, "Type is required"],
    },

    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Open", "Claimed"],
      default: "Open",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("LostFound", lostFoundSchema);