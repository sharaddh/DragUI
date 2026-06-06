import OpenAI from "openai";

const openai =
new OpenAI({
 apiKey:
 process.env.OPENAI_API_KEY
});

export const generateRoute =
async (
 routeName
) => {

 const response =
 await openai.chat.completions.create({

  model:"gpt-4o",

  messages:[
   {
    role:"system",

    content:`
Generate Express route.

Return code only.
`
   },

   {
    role:"user",

    content:
    routeName
   }
  ]
 });

 return response
 .choices[0]
 .message.content;
};