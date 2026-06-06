import OpenAI from "openai";

const openai =
new OpenAI({
 apiKey:
 process.env.OPENAI_API_KEY
});

export const generateModel =
async (
 modelName,
 fields
) => {

 const response =
 await openai.chat.completions.create({

  model:"gpt-4o",

  messages:[
   {
    role:"system",

    content:`
Generate Mongoose model.

Return code only.
`
   },

   {
    role:"user",

    content:
`
Model:
${modelName}

Fields:
${JSON.stringify(fields)}
`
   }
  ]
 });

 return response
 .choices[0]
 .message.content;
};