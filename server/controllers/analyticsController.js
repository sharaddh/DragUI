import ComponentAnalytics
from "../models/ComponentAnalytics.js";

export const trackView =
async(req,res)=>{

 await ComponentAnalytics
 .findOneAndUpdate(

 {
  component:
   req.params.id
 },

 {
  $inc:{
   views:1
  }
 },

 {
  upsert:true
 }

 );

 res.json({
  success:true
 });

};