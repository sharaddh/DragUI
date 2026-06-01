import mongoose from "mongoose";

const schema =
new mongoose.Schema(
{
 component:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"Component"
 },

 version:String,

 template:String,

 props:[Object],

 files:[String]
},
{
 timestamps:true
});

export default mongoose.model(
 "ComponentVersion",
 schema
);