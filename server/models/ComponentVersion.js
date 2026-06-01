import mongoose from "mongoose";

const componentVersionSchema =
new mongoose.Schema(
{
  component:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Component"
  },

  version:String,

  template:String,

  props:[Object],

  dependencies:[String],

  changelog:String
},
{
  timestamps:true
});

export default mongoose.model(
  "ComponentVersion",
  componentVersionSchema
);