import Component from "../models/Component.js";
import ComponentVersion from "../models/ComponentVersion.js";

export const createVersion =
async (req,res)=>{

 try{

  const component =
   await Component.findById(
    req.params.id
   );

  if(!component){

   return res.status(404)
   .json({
    message:"Component not found"
   });

  }

  const version =
   await ComponentVersion.create({

    componentId:
     component._id,

    version:
     component.version,

    code:
     component.code,

    props:
     component.props,

    changelog:
     req.body.changelog

   });

  res.json({
   success:true,
   version
  });

 }catch(error){

  res.status(500).json({
   message:error.message
  });

 }

};