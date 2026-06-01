import multer from "multer";

import { CloudinaryStorage }
from "multer-storage-cloudinary";

import cloudinary from "../config/cloudinary.js";

const storage =
  new CloudinaryStorage({
    cloudinary,

    params: async (
      req,
      file
    ) => ({
      folder: "dropui",

      resource_type: "auto",

      public_id:
        Date.now() +
        "-" +
        file.originalname,
    }),
  });

const fileFilter = (
  req,
  file,
  cb
) => {
  const allowed = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/svg+xml",

    "video/mp4",
    "video/quicktime",

    "application/pdf",

    "application/zip",
    "application/x-zip-compressed",
  ];

  if (
    allowed.includes(
      file.mimetype
    )
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Unsupported file type"
      ),
      false
    );
  }
};

const upload = multer({
  storage,

  limits: {
    fileSize:
      100 * 1024 * 1024,
  },

  fileFilter,
});

export default upload;