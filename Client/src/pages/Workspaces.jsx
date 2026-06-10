import mongoose from "mongoose";

const workspaceSchema =
new mongoose.Schema({

 name:{
  type:String,
  required:true
 },

 slug:{
  type:String,
  unique:true
 },

 owner:{
  type:
   mongoose.Schema.Types.ObjectId,

  ref:"Admin"
 },

 members:[{

  user:{
   type:
    mongoose.Schema.Types.ObjectId,

   ref:"Admin"
  },

  role:{
   type:String,

   enum:[
    "owner",
    "admin",
    "developer",
    "designer",
    "reviewer",
    "viewer"
   ],

   default:"viewer"
  }

 }]

},{
 timestamps:true
});

export default
mongoose.models.Workspace ||

mongoose.model(
 "Workspace",
 workspaceSchema
);