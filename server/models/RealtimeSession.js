import mongoose from "mongoose";

const realtimeSessionSchema =
new mongoose.Schema(
{
  project: {
    type:
      mongoose.Schema.Types.ObjectId,
    ref:"Project"
  },

  user: {
    type:
      mongoose.Schema.Types.ObjectId,
    ref:"User"
  },

  socketId:String,

  joinedAt:{
    type:Date,
    default:Date.now
  }
});

export default mongoose.model(
  "RealtimeSession",
  realtimeSessionSchema
);