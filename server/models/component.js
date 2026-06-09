import mongoose from "mongoose";

const propSchema =
new mongoose.Schema(
{
  name: String,

  label: String,

  type: {
    type: String,
    enum: [
      "text",
      "number",
      "color",
      "boolean",
      "select",
      "image",
      "url",
    ],
    default: "text",
  },

  defaultValue:
    mongoose.Schema.Types.Mixed,

  required: {
    type: Boolean,
    default: false,
  },

  options: [String],
},
{
  _id: false,
}
);

const componentSchema =
new mongoose.Schema(
{
  name: {
    type: String,
    required: true,
  },

  slug: {
    type: String,
    unique: true,
  },

  label: String,

  description: String,

  type: {
    type: String,
    enum: [
      "frontend",
      "backend",
    ],
    default: "frontend",
  },

  category: String,

  tags: [String],

  version: {
    type: String,
    default: "1.0.0",
  },

  visibility: {
    type: String,
    enum: [
      "public",
      "private",
    ],
    default: "public",
  },

  status: {
    type: String,
    enum: [
      "draft",
      "published",
      "deprecated",
    ],
    default: "draft",
  },

  template: String,

  code: String,

  props: [propSchema],

  thumbnail: String,

  dependencies: [String],

  peerDependencies: [String],

  envVariables: [String],

  files: [
    {
      name: String,
      url: String,
      publicId: String,
      size: Number,
      type: String,
    },
  ],
  workspace: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Workspace"
},
thumbnail: {
  type: String,
  default: "",
},

thumbnailPublicId: {
  type: String,
  default: "",
},
  downloads: {
    type: Number,
    default: 0,
  },

  usageCount: {
    type: Number,
    default: 0,
  },
thumbnail: String,

gallery: [String],

video: String,

assets: [
 {
  name: String,
  url: String,
  type: String
 }
],
  createdBy: {
    type:
      mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
},
{
  timestamps: true,
}
);

export default mongoose.models.Component ||
mongoose.model(
  "Component",
  componentSchema
);