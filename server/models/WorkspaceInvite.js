import mongoose from "mongoose";

const workspaceInviteSchema =
new mongoose.Schema(
{
  workspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workspace",
    required: true
  },

  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  email: {
    type: String,
    required: true,
    lowercase: true
  },

  role: {
    type: String,
    enum: [
      "admin",
      "developer",
      "designer",
      "viewer"
    ],
    default: "viewer"
  },

  token: {
    type: String,
    required: true,
    unique: true
  },

  status: {
    type: String,
    enum: [
      "pending",
      "accepted",
      "expired",
      "cancelled"
    ],
    default: "pending"
  },

  expiresAt: {
    type: Date,
    required: true
  }
},
{
  timestamps: true
}
);

workspaceInviteSchema.index({
  expiresAt: 1
});

export default mongoose.model(
  "WorkspaceInvite",
  workspaceInviteSchema
);