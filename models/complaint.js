const mongoose = require("mongoose");

const studentComplaintSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
      trim: true
    },

    erpId: {
      type: String,
      required: true,
      trim: true,
      uppercase: true
    },

    phone: {
      type: String,
      required: true,
      trim: true
    },

    course: {
      type: String,
      required: true,
      trim: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      required: true,
      default: "Other"
    },

    priority: {
      type: String,
      enum: [
        "Low",
        "Medium",
        "High"
      ],
      default: "Medium"
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    image: {
      type: String,
      default: ""
    },

    status: {
      type: String,
      enum: [
        "pending",
        "in progress",
        "resolved"
      ],
      default: "pending"
    }
  },

  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "StudentComplaint",
  studentComplaintSchema
);