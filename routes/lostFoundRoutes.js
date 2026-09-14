const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const LostFound =
  require("../models/LostFound");

const adminMiddleware =
  require("../middleware/adminMiddleware");

console.log(
  "LOST FOUND ROUTES LOADED"
);

// =========================
// UPLOAD DIRECTORY
// =========================

const uploadDir =
  path.join(
    __dirname,
    "../uploads"
  );

if (!fs.existsSync(uploadDir)) {

  fs.mkdirSync(
    uploadDir,
    {
      recursive: true
    }
  );
}

// =========================
// MULTER
// =========================

const storage =
  multer.diskStorage({

    destination: (
      req,
      file,
      cb
    ) => {

      cb(
        null,
        uploadDir
      );
    },

    filename: (
      req,
      file,
      cb
    ) => {

      const uniqueName =
        Date.now() +
        "-" +
        Math.round(
          Math.random() *
            1e9
        ) +
        path.extname(
          file.originalname
        );

      cb(
        null,
        uniqueName
      );
    }

  });

const upload =
  multer({

    storage: storage,

    fileFilter: (
      req,
      file,
      cb
    ) => {

      if (
        file.mimetype.startsWith(
          "image/"
        )
      ) {

        cb(
          null,
          true
        );

      } else {

        cb(
          new Error(
            "Only image files are allowed"
          )
        );
      }
    }

  });

// =====================================================
// ADMIN - LOST & FOUND STATISTICS
// =====================================================

router.get(
  "/stats",
  adminMiddleware,
  async (req, res) => {

    try {

      const total =
        await LostFound.countDocuments();

      const open =
        await LostFound.countDocuments({
          status: "Open"
        });

      const claimed =
        await LostFound.countDocuments({
          status: "Claimed"
        });

      res.json({

        success: true,

        stats: {
          total,
          open,
          claimed
        }

      });

    } catch (error) {

      console.error(
        "LostFound Stats Error:",
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
// STUDENT - CREATE LOST & FOUND ITEM
// =====================================================

router.post(
  "/create",
  upload.single("image"),
  async (req, res) => {

    try {

      const {
        studentName,
        erpId,
        phone,
        course,
        title,
        type,
        location,
        description
      } = req.body;

      if (
        !studentName ||
        !erpId ||
        !phone ||
        !course ||
        !title ||
        !type ||
        !location ||
        !description
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Please fill all required fields"

        });
      }

      const item =
        new LostFound({

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

          type,

          location:
            location.trim(),

          description:
            description.trim(),

          image:
            req.file
              ? `/uploads/${req.file.filename}`
              : "",

          status:
            "Open"

        });

      await item.save();

      res.status(201).json({

        success: true,

        message:
          "Lost & Found item added successfully",

        item

      });

    } catch (error) {

      console.error(
        "Create LostFound Error:",
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
// STUDENT + ADMIN - GET ALL ITEMS
// =====================================================

router.get(
  "/",
  async (req, res) => {

    try {

      const items =
        await LostFound.find()
          .sort({
            createdAt: -1
          });

      res.json(
        items
      );

    } catch (error) {

      console.error(
        "Fetch LostFound Error:",
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
// ADMIN - UPDATE STATUS
// =====================================================

router.put(
  "/:id/status",
  adminMiddleware,
  async (req, res) => {

    try {

      const item =
        await LostFound.findById(
          req.params.id
        );

      if (!item) {

        return res.status(404).json({

          success: false,

          message:
            "Item not found"

        });
      }

      if (
        item.status === "Open"
      ) {

        item.status =
          "Claimed";

      } else {

        item.status =
          "Open";
      }

      await item.save();

      res.json({

        success: true,

        message:
          "Status updated successfully",

        item

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
// ADMIN - DELETE ITEM
// =====================================================

router.delete(
  "/:id",
  adminMiddleware,
  async (req, res) => {

    try {

      const item =
        await LostFound.findByIdAndDelete(
          req.params.id
        );

      if (!item) {

        return res.status(404).json({

          success: false,

          message:
            "Item not found"

        });
      }

      res.json({

        success: true,

        message:
          "Item deleted successfully"

      });

    } catch (error) {

      console.error(
        "Delete LostFound Error:",
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