import mongoose from "mongoose";

const projectSchema =
new mongoose.Schema(
{
  owner: {
    type:
      mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  projectId: {
    type: String,
    unique: true,
  },

  name: {
    type: String,
    required: true,
  },

  description: String,

  type: {
    type: String,
    enum: [
      "frontend",
      "backend",
      "fullstack",
    ],
  },
isMarketplace:{
 type:Boolean,
 default:false
},
workspace: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Workspace"
},
  visibility: {
    type: String,
    enum: [
      "public",
      "private",
    ],
    default: "private",
  },

  frontend: [Object],

  backend: [Object],

  installs: {
    type: Number,
    default: 0,
  },

  version: {
    type: String,
    default: "1.0.0",
  },

  tags: [String],

  thumbnail: String,

  isPublished: {
    type: Boolean,
    default: false,
  },
},
{
  timestamps: true,
}
);

export default mongoose.model(
  "Project",
  projectSchema
);