import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
{
  admin:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Admin"
  },

  action:String,

  resource:String,

  resourceId:String,

  metadata:Object
},
{
  timestamps:true
}
);

export default mongoose.model(
  "Activity",
  activitySchema
);