import mongoose from "mongoose";

const assetSchema =
new mongoose.Schema(
{
  name: String,

  url: String,

  publicId: String,

  type: {
    type: String,
    enum: [
      "image",
      "video",
      "pdf",
      "zip",
      "svg",
      "other",
    ],
  },

  size: Number,

  uploadedBy: {
    type:
      mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },

  usedIn: [
    {
      type:
        mongoose.Schema.Types.ObjectId,
      ref: "Component",
    },
  ],
},
{
  timestamps: true,
}
);

export default mongoose.model(
  "Asset",
  assetSchema
);