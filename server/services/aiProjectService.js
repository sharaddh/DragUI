import getOpenAI from "./aiService.js";

export const generateProject =
async (
 prompt
) => {

 const openai = getOpenAI();

 const response =
   await openai.chat.completions.create({
     model: "gpt-4o",

     messages: [
       {
         role: "system",

         content: `
You are a senior software architect.

Return valid JSON only.

Structure:

{
  "title":"",
  "description":"",
  "frontend":[
    {
      "name":"",
      "type":"page"
    }
  ],
  "backend":[
    {
      "name":"",
      "type":"route"
    }
  ],
  "database":[
    {
      "name":"",
      "fields":[]
    }
  ]
}
`
       },

       {
         role:"user",
         content:prompt
       }
     ],

     response_format:{
       type:"json_object"
     }
   });

 return JSON.parse(
   response.choices[0]
   .message.content
 );
};