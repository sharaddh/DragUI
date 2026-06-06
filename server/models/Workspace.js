import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  role: {
    type: String,
    enum: [
      "owner",
      "admin",
      "developer",
      "designer",
      "viewer"
    ],
    default: "viewer"
  },

  joinedAt: {
    type: Date,
    default: Date.now
  }
},
{
  _id: false
}
);

const workspaceSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true,
    trim: true
  },

  slug: {
    type: String,
    unique: true
  },

  description: String,

  logo: String,

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  members: [memberSchema],

  projects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project"
    }
  ],

  components: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Component"
    }
  ],

  assets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset"
    }
  ],

  settings: {
    allowInvites: {
      type: Boolean,
      default: true
    },

    publicProfile: {
      type: Boolean,
      default: false
    }
  }
},
{
  timestamps: true
}
);

export default mongoose.model(
  "Workspace",
  workspaceSchema
);