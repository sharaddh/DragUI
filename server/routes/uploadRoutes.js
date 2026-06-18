import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

// 1. Keep it in memory (faster, doesn't bloat your server)
const upload = multer({
  storage: multer.memoryStorage()
});

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
    }

    // 2. Convert the memory buffer into a Base64 Data URI
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = "data:" + req.file.mimetype + ";base64," + b64;

    // 3. Upload the dataURI directly to Cloudinary
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

    // 4. Send the successful URL back to the frontend
    res.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id
    });

  } catch (error) {
    console.error("🔥 ASSET UPLOAD ERROR:", error);
    res.status(500).json({
      message: error.message || "Cloudinary Upload Failed"
    });
  }
});

export default router;