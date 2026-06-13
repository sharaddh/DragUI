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
export const getManifest =
async(req,res)=>{

 const component =
 await Component.findOne({

  slug:
   req.params.name,

  status:
   "published"

 });

 if(!component){

  return res.status(404)
  .json({
   success:false
  });

 }

 res.json({

  success:true,

  manifest:{

   name:
    component.slug,

   version:
    component.version,

   files:
    component.files,

   dependencies:
    component.dependencies,

   assets:
    component.assets

  }

 });

};