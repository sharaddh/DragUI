import openai
from "../services/aiService.js";

export const generateComponent =
async(
 req,
 res
)=>{

 try{

  const {
   prompt
  } = req.body;

  const response =
   await openai.chat.completions.create({

    model:
     "gpt-4.1",

    messages:[
     {
      role:"system",

      content:
`
Generate production ready React component.

Return JSON:

{
 name:"",
 code:"",
 props:[]
}
`
     },

     {
      role:"user",

      content:
       prompt
     }
    ]

   });

  res.json({
   success:true,

   data:
    response
    .choices[0]
    .message
    .content
  });

 }catch(error){

  res.status(500).json({
   message:
    error.message
  });

 }

};