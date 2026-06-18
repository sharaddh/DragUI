import cloudinary from "../config/cloudinary.js";

export const uploadAsset = async (
  req,
  res
) => {

  try {

    const result =
      await cloudinary.uploader.upload(
        req.file.path,
        {
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
        }
      );

    return res.json({
      success: true,

      url:
        result.secure_url,

      publicId:
        result.public_id
    });

  } catch (error) {

    console.error("🔥 ASSET UPLOAD ERROR:", error);
    
    res.status(500).json({ message: error.message || "Upload Failed" });

  }

};