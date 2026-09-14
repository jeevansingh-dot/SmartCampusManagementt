const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Complaint = require("../models/complaint");
const adminMiddleware = require("../middleware/adminMiddleware");

// =========================
// UPLOAD DIRECTORY
// =========================

console.log("COMPLAINT STATS ROUTE LOADED");

const uploadDir = path.join(
  __dirname,
  "../uploads"
);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true
  });
}

// =========================
// MULTER
// =========================

const storage = multer.diskStorage({
  destination: (
    req,
    file,
    cb
  ) => {
    cb(null, uploadDir);
  },

  filename: (
    req,
    file,
    cb
  ) => {
    const uniqueName =
      Date.now() +
      "-" +
      file.originalname.replace(
        /\s+/g,
        "_"
      );

    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage
});

// =========================
// SAFE UPLOAD
// =========================

const safeUpload = (
  req,
  res,
  next
) => {

  upload.single("image")(
    req,
    res,
    (err) => {

      if (err) {

        console.error(
          "Multer Upload Error:",
          err
        );

        return res.status(400).json({
          success: false,
          message:
            "Image upload failed: " +
            err.message
        });
      }

      next();
    }
  );
};

// =====================================================
// ADMIN - COMPLAINT STATISTICS
// =====================================================

router.get(
  "/stats",
  adminMiddleware,
  async (req, res) => {

    try {

      const total =
        await Complaint.countDocuments();

      const pending =
        await Complaint.countDocuments({
          status: "pending"
        });

      const inProgress =
        await Complaint.countDocuments({
          status: "in progress"
        });

      const resolved =
        await Complaint.countDocuments({
          status: "resolved"
        });

      res.json({

        success: true,

        stats: {
          total,
          pending,
          inProgress,
          resolved
        }

      });

    } catch (error) {

      console.error(
        "Complaint Stats Error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message

      });
    }
  }
);

// =====================================================
// ADMIN - GET ALL COMPLAINTS
// =====================================================

router.get(
  "/",
  adminMiddleware,
  async (req, res) => {

    try {

      const complaints =
        await Complaint.find()
          .sort({
            createdAt: -1
          });

      res.json(
        complaints
      );

    } catch (error) {

      console.error(
        "GET Complaints Error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message

      });
    }
  }
);

// =====================================================
// STUDENT - GET OWN COMPLAINTS
// =====================================================

router.get(
  "/erp/:erpId",
  async (req, res) => {

    try {

      const erpId =
        req.params.erpId
          .trim()
          .toUpperCase();

      const complaints =
        await Complaint.find({
          erpId: erpId
        }).sort({
          createdAt: -1
        });

      res.json({

        success: true,

        count:
          complaints.length,

        complaints:
          complaints

      });

    } catch (error) {

      console.error(
        "ERP Complaint Search Error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message

      });
    }
  }
);

// =====================================================
// STUDENT - CREATE COMPLAINT
// =====================================================

router.post(
  "/",
  safeUpload,
  async (req, res) => {

    try {

      const {
        title,
        category,
        studentName,
        erpId,
        phone,
        course,
        priority,
        description
      } = req.body;

      if (
        !studentName ||
        !erpId ||
        !phone ||
        !course ||
        !title ||
        !description
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Please fill all required fields"

        });
      }

      const newComplaint =
        new Complaint({

          studentName:
            studentName.trim(),

          erpId:
            erpId
              .trim()
              .toUpperCase(),

          phone:
            phone.trim(),

          course:
            course.trim(),

          title:
            title.trim(),

          category:
            category || "Other",

          priority:
            priority || "Medium",

          description:
            description.trim(),

          image:
            req.file
              ? `/uploads/${req.file.filename}`
              : "",

          status:
            "pending"
        });

      const savedComplaint =
        await newComplaint.save();

      res.status(201).json({

        success: true,

        message:
          "Complaint submitted successfully",

        complaint:
          savedComplaint

      });

    } catch (error) {

      console.error(
        "POST Complaint Error:",
        error
      );

      res.status(400).json({

        success: false,

        message:
          error.message

      });
    }
  }
);

// =====================================================
// ADMIN - UPDATE COMPLAINT STATUS
// =====================================================

router.put(
  "/:id/status",
  adminMiddleware,
  async (req, res) => {

    try {

      const complaint =
        await Complaint.findById(
          req.params.id
        );

      if (!complaint) {

        return res.status(404).json({

          success: false,

          message:
            "Complaint not found"

        });
      }

      if (
        complaint.status ===
        "pending"
      ) {

        complaint.status =
          "in progress";

      } else if (
        complaint.status ===
        "in progress"
      ) {

        complaint.status =
          "resolved";

      }

      await complaint.save();

      res.json({

        success: true,

        message:
          "Complaint status updated",

        complaint:
          complaint

      });

    } catch (error) {

      console.error(
        "Status Update Error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message

      });
    }
  }
);

// =====================================================
// ADMIN - DELETE COMPLAINT
// =====================================================

router.delete(
  "/:id",
  adminMiddleware,
  async (req, res) => {

    try {

      const complaint =
        await Complaint.findByIdAndDelete(
          req.params.id
        );

      if (!complaint) {

        return res.status(404).json({

          success: false,

          message:
            "Complaint not found"

        });
      }

      res.json({

        success: true,

        message:
          "Complaint deleted successfully"

      });

    } catch (error) {

      console.error(
        "Delete Complaint Error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message

      });
    }
  }
);

module.exports = router;
