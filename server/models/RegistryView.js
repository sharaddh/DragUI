import mongoose
from "mongoose";

const schema =
 new mongoose.Schema({

  component:{
   type:
    mongoose.Schema.Types.ObjectId,

   ref:"Component"
  },

  views:{
   type:Number,
   default:0
  },

  downloads:{
   type:Number,
   default:0
  }

 },{
  timestamps:true
 });

export default
mongoose.models.RegistryView ||

mongoose.model(
 "RegistryView",
 schema
);