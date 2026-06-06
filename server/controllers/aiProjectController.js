import AIProject
from "../models/AIProject.js";
import {buildFullProject}from "../services/fullProjectGenerator.js";
import {
 generateProject
}
from "../services/aiProjectService.js";

export const create =
async (
 req,
 res
) => {

 try {

   const generated =
     await generateProject(
       req.body.prompt
     );

   const project =
     await AIProject.create({
       user:
         req.userId,

       prompt:
         req.body.prompt,

       title:
         generated.title,

       description:
         generated.description,

       generatedData:
         generated,

       status:
         "completed"
     });

   res.json({
     success:true,
     project
   });

 } catch(error){

   res.status(500).json({
     success:false,
     message:error.message
   });

 }

};

export const getOne =
async (
 req,
 res
) => {

 try {

   const project =
     await AIProject.findById(
       req.params.id
     );

   res.json({
     success:true,
     project
   });

 } catch(error){

   res.status(500).json({
     success:false,
     message:error.message
   });

 }

};

export const getAll =
async (
 req,
 res
) => {

 try {

   const projects =
     await AIProject.find({
       user:
         req.userId
     })
     .sort({
       createdAt:-1
     });

   res.json({
     success:true,
     projects
   });

 } catch(error){

   res.status(500).json({
     success:false,
     message:error.message
   });

 }

};
export const generateCode =
async (
 req,
 res
) => {

 try {

  const generated =
   await generateProject(
    req.body.prompt
   );

  const files =
   await buildFullProject(
    generated
   );

  res.json({

   success:true,

   blueprint:
    generated,

   files
  });

 } catch(error){

  res.status(500).json({

   success:false,

   message:
    error.message
  });

 }

};