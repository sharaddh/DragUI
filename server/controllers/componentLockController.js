import Component
from "../models/Component.js";

export const lockComponent =
async (req,res)=>{

 try{

  const component =
   await Component.findById(
    req.params.id
   );

  if(!component){

   return res.status(404)
   .json({
    success:false,
    message:"Component not found"
   });

  }

  if(
   component.lockedBy &&
   component.lockedBy.toString()
   !== req.adminId
  ){

   return res.status(400)
   .json({
    success:false,
    message:
     "Already locked"
   });

  }

  component.lockedBy =
   req.adminId;

  component.lockedAt =
   new Date();

  await component.save();

  res.json({
   success:true,
   component
  });

 }catch(error){

  res.status(500).json({
   success:false,
   message:error.message
  });

 }

};

export const unlockComponent =
async(req,res)=>{

 try{

  const component =
   await Component.findById(
    req.params.id
   );

  if(!component){

   return res.status(404)
   .json({
    success:false,
    message:"Component not found"
   });

  }

  component.lockedBy =
   null;

  component.lockedAt =
   null;

  await component.save();

  res.json({
   success:true,
   component
  });

 }catch(error){

  res.status(500).json({
   success:false,
   message:error.message
  });

 }

};