import express from "express";
import multer from "multer";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";
import Asset from "../models/Asset.js";
import Admin from "../models/Admin.js";

const router = express.Router();

// Enforce a size cap and MIME whitelist (was unlimited before)
const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "video/mp4",
  "video/quicktime",
  "application/pdf",
  "application/zip",
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME.has(file.mimetype)) return cb(null, true);
    cb(new Error("Unsupported file type"));
  },
});

// Accept either an authenticated user token ({ userId }) or
// admin token ({ adminId }) - both are uploads by logged-in principals.
async function requireAnyAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    if (!header.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    const decoded =
      jwt.verify(header.split(" ")[1], process.env.JWT_SECRET);

    if (decoded.adminId) {
      const admin = await Admin.findById(decoded.adminId).select("_id isActive");
      if (!admin || !admin.isActive) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }
      req.adminId = admin._id;
      return next();
    }

    if (decoded.userId) {
      req.userId = decoded.userId;
      return next();
    }

    return res.status(401).json({ success: false, message: "Authentication required" });
  } catch {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
}

router.post("/", requireAnyAuth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
    }

    // Convert the memory buffer into a Base64 Data URI
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = "data:" + req.file.mimetype + ";base64," + b64;

    // Upload the dataURI directly to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "dropui",
      resource_type: "auto",
      quality: "auto",
      fetch_format: "auto",
      transformation: [
        {
          width: 1920,
          crop: "limit"
        }
      ]
    });

    // Record the asset so /api/assets listings reflect reality
    try {
      await Asset.create({
        name: req.file.originalname,
        url: result.secure_url,
        publicId: result.public_id,
        type: result.resource_type === "video" ? "video" : (req.file.mimetype.split("/")[0] === "image" ? "image" : "other"),
        size: req.file.size,
        uploadedBy: req.adminId || undefined,
      });
    } catch {
      // non-fatal - the upload itself succeeded
    }

    res.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id
    });

  } catch (error) {
    console.error("ASSET UPLOAD ERROR:", error);
    res.status(500).json({
      message: error.message || "Cloudinary Upload Failed"
    });
  }
});

export default router;
