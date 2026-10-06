import getOpenAI from "./aiService.js";

export const generateReactPage =
async (
 pageName,
 description
) => {

 const openai = getOpenAI();

 const response =
 await openai.chat.completions.create({

  model:"gpt-4o",

  messages:[
   {
    role:"system",

    content:`
Generate production-ready React page.

Rules:
- React
- Tailwind
- Responsive
- Export Default
- Return only code
`
   },

   {
    role:"user",

    content:
    `
Page:
${pageName}

Description:
${description}
`
   }
  ]
 });

 return response
 .choices[0]
 .message.content;
};