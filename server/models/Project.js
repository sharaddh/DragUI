import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  userId: String,
  name: String,
  uniqueId: { type: String, index: true },
  isPublic: { type: Boolean, default: false },
  design: Object, // your tree JSON
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Project", projectSchema);