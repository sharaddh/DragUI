import RealtimeSession
from "../models/RealtimeSession.js";

export const getActiveUsers =
async (
 req,
 res
) => {

 try {

   const sessions =
     await RealtimeSession.find({
       project:
         req.params.projectId
     })
     .populate(
       "user",
       "username avatar"
     );

   res.json({
     success:true,
     sessions
   });

 } catch(error){

   res.status(500).json({
     success:false,
     message:error.message
   });

 }

};