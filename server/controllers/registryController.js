import Component
from "../models/Component.js";

export const getRegistry =
async(req,res)=>{

 const components =
  await Component.find({

   status:
    "published"

  });

 res.json({
  success:true,
  components
 });

};

export const getRegistryComponent =
async(req,res)=>{

 const component =
  await Component.findOne({

   slug:
    req.params.slug

  });

 if(!component){

  return res.status(404)
  .json({
   success:false
  });

 }

 res.json({
  success:true,
  component
 });

};