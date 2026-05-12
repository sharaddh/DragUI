import mongoose from "mongoose";

const propSchema = new mongoose.Schema({
  name: String,
  label: String,
  type: String, // text, color, select, number, boolean, alignment, fontSize
  default: String,
  options: [String],
}, { _id: false });

const componentSchema = new mongoose.Schema({
  name: String,
  label: String,
  type: String, // frontend / backend
  category: String,
  description: String,
  path: String, // template path
  code: String, // JSX code
  installSteps: String, // Installation instructions
  props: [propSchema],
  files: [String],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Component", componentSchema);