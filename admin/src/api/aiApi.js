import api
from "./axios";

export const generateAIComponent =
async(prompt)=>{

 const res =
 await api.post(
  "/ai/generate",
  {
   prompt
  }
 );

 return res.data;

};