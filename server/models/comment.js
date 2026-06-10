import mongoose
from "mongoose";

const schema =
new mongoose.Schema({

 componentId:{
  type:String,
  required:true
 },

 line:Number,

 message:String,

 author:{
  type:
   mongoose.Schema.Types.ObjectId,

  ref:"Admin"
 }

},{
 timestamps:true
});

export default
mongoose.models.Comment ||

mongoose.model(
 "Comment",
 schema
);