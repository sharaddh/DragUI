import mongoose from "mongoose";

const componentAnalyticsSchema =
new mongoose.Schema(
{
  component: {
    type:
      mongoose.Schema.Types.ObjectId,
    ref: "Component",
    required: true,
  },

  views: {
    type: Number,
    default: 0,
  },

  downloads: {
    type: Number,
    default: 0,
  },

  pulls: {
    type: Number,
    default: 0,
  },

  installs: {
    type: Number,
    default: 0,
  },

  likes: {
    type: Number,
    default: 0,
  },
},
{
  timestamps: true,
}
);

export default mongoose.model(
  "ComponentAnalytics",
  componentAnalyticsSchema
);