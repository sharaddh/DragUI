import mongoose from "mongoose";

const aiProjectSchema =
new mongoose.Schema(
{
  user: {
    type:
      mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  prompt: String,

  title: String,

  description: String,

  type: {
    type: String,
    enum: [
      "frontend",
      "backend",
      "fullstack"
    ],
    default: "fullstack"
  },

  generatedData: Object,

  status: {
    type: String,
    enum: [
      "pending",
      "completed",
      "failed"
    ],
    default: "pending"
  }
},
{
  timestamps: true
}
);

export default mongoose.model(
  "AIProject",
  aiProjectSchema
);