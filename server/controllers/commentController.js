import Comment
from "../models/Comment.js";

export const createComment =
async(req,res)=>{

 try{

  // Whitelist fields; author always comes from the authenticated admin
  const {
    componentId,
    line,
    message,
  } = req.body;

  if (!componentId || !message) {
    return res.status(400).json({
      success: false,
      message: "componentId and message are required",
    });
  }

  const comment =
   await Comment.create({
    componentId,
    line,
    message,
    author: req.adminId,
   });

  res.json({
   success:true,
   comment
  });

 }catch(error){

  res.status(500).json({
   success:false,
   message:
    error.message
  });

 }

};

export const getComments =
async(req,res)=>{

 try{

  const comments =
   await Comment.find({

    componentId:
     req.params.id

  }).populate("author", "adminId email avatar");

  res.json({
   success:true,
   comments
  });

 }catch(error){

  res.status(500).json({
   success:false,
   message:
    error.message
  });

 }

};
