import cloudinary
from "../config/cloudinary.js";

export const deleteAsset =
async (publicId) => {
  return cloudinary.uploader.destroy(
    publicId,
    {
      resource_type:
        "auto"
    }
  );
};