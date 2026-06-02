import * as projectService
from "../services/projectService.js";

export const create =
async (
 req,
 res
) => {

 try {

   const project =
     await projectService.createProject(
       req.body,
       req.userId
     );

   res.status(201).json({
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
     await projectService.getProject(
       req.params.projectId
     );

   if(!project){
     return res.status(404)
       .json({
         success:false
       });
   }

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