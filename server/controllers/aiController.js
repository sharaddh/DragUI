import openai from "../services/aiService.js";

export const generateComponent =
async (req, res) => {

 try {

  const { prompt } = req.body;

  if (!prompt) {

   return res.status(400).json({
    success: false,
    message: "Prompt is required"
   });

  }

  const response =
   await openai.chat.completions.create({

    model: "gpt-4.1",

    messages: [

     {
      role: "system",

      content: `
Generate a production-ready React component.

Return ONLY valid JSON:

{
  "name":"",
  "code":"",
  "props":[]
}
`
     },

     {
      role: "user",
      content: prompt
     }

    ]

   });

  res.json({

   success: true,

   data:
    response
     .choices[0]
     .message
     .content

  });

 } catch (error) {

  res.status(500).json({

   success: false,

   message:
    error.message

  });

 }

};

export const improveComponent =
async (req, res) => {

 try {

  const {
   code,
   instruction
  } = req.body;

  const response =
   await openai.chat.completions.create({

    model: "gpt-4.1",

    messages: [

     {
      role: "system",

      content:
       "Improve the provided React component and return only the updated code."
     },

     {
      role: "user",

      content: `
Instruction:
${instruction}

Component:
${code}
`
     }

    ]

   });

  res.json({

   success: true,

   code:
    response
     .choices[0]
     .message
     .content

  });

 } catch (error) {

  res.status(500).json({

   success: false,

   message:
    error.message

  });

 }

};

export const generateDocs =
async (req, res) => {

 try {

  const {
   componentName,
   code
  } = req.body;

  const response =
   await openai.chat.completions.create({

    model: "gpt-4.1",

    messages: [

     {
      role: "system",

      content:
       "Generate markdown documentation for a React component."
     },

     {
      role: "user",

      content: `
Component:
${componentName}

Code:
${code}
`
     }

    ]

   });

  res.json({

   success: true,

   docs:
    response
     .choices[0]
     .message
     .content

  });

 } catch (error) {

  res.status(500).json({

   success: false,

   message:
    error.message

  });

 }

};