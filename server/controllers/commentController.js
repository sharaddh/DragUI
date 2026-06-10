import Comment
from "../models/Comment.js";

export const createComment =
async(req,res)=>{

 try{

  const comment =
   await Comment.create(
    req.body
   );

  res.json({
   success:true,
   comment
  });

 }catch(error){

  res.status(500).json({
   message:
    error.message
  });

 }

};

export const getComments =
async(req,res)=>{

 const comments =
  await Comment.find({

   componentId:
    req.params.id

  });

 res.json({
  success:true,
  comments
 });

};