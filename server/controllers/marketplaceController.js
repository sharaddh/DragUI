import Component
from "../models/Component.js";

export const popular =
async (
 req,
 res
) => {

 try {

   const components =
     await Component.find({
       status:
         "published"
     })
     .sort({
       downloads:-1,
       usageCount:-1
     })
     .limit(50);

   res.json({
     success:true,
     components
   });

 } catch(error){

   res.status(500).json({
     success:false,
     message:error.message
   });

 }

};