import mongoose from "mongoose";

const assetSchema = new mongoose.Schema(
{
  name:String,

  url:String,

  publicId:String,

  type:String,

  size:Number,

  uploadedBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Admin"
  }

},
{
  timestamps:true
});

export default mongoose.model(
  "Asset",
  assetSchema
);