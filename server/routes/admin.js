// import express from "express";
// import axios from "axios";
// import Component from "../models/components.js";
// import { upload } from "../middleware/upload.js";
// import adminAuth from "../middleware/adminAuth.js";

// const router = express.Router();

// // 🔥 Create Component with Code (New Format - Protected)
// router.post(
//   "/components/create",
//   adminAuth,
//   async (req, res) => {
//     try {
//       const { name, label, category, description, template, installSteps, props } = req.body;

//       if (!name || !category) {
//         return res.status(400).json({ message: "Name and category are required" });
//       }

//       const component = await Component.create({
//         name,
//         label: label || name,
//         category,
//         description: description || "",
//         installSteps: installSteps || "",
//         props: props || [],
//         code: template || "",
//         path: `${category}/${name}`,
//       });

//       res.status(201).json({
//         message: "Component created successfully",
//         component,
//       });
//     } catch (err) {
//       console.error("Component creation error:", err);
//       res.status(500).json({ message: err.message });
//     }
//   }
// );

// // 🔥 Upload Component (Protected) - Legacy format
// router.post(
//   "/component",
//   adminAuth,
//   upload.array("files"),
//   async (req, res) => {
//     try {
//       const { name, type, category, props } = req.body;

//       if (!name || !type || !category) {
//         return res.status(400).json({ message: "Name, type, and category are required" });
//       }

//       const files = req.files ? req.files.map((f) => f.filename) : [];

//       const component = await Component.create({
//         name,
//         type,
//         category,
//         path: `${type}/${name}`,
//         props: props ? props.split(",").map(p => ({ name: p.trim() })) : [],
//         files,
//       });

//       res.status(201).json({
//         message: "Component created successfully",
//         component,
//       });
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   }
// );

// // Get all components
// router.get("/components", adminAuth, async (req, res) => {
//   try {
//     const components = await Component.find();
//     res.json(components);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // Delete component
// router.delete("/component/:id", adminAuth, async (req, res) => {
//   try {
//     const component = await Component.findByIdAndDelete(req.params.id);
//     res.json({ message: "Component deleted", component });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// export default router;

// // AI helpers: fix or generate code using OpenAI (requires OPENAI_API_KEY env)
// router.post("/components/ai/fix", adminAuth, async (req, res) => {
//   try {
//     const { code } = req.body;
//     if (!code) return res.status(400).json({ message: "code is required" });

//     if (!process.env.OPENAI_API_KEY) {
//       return res.status(501).json({ message: "AI not configured on server (OPENAI_API_KEY missing)" });
//     }

//     const resp = await axios.post(
//       "https://api.openai.com/v1/chat/completions",
//       {
//         model: "gpt-4o-mini",
//         messages: [
//           { role: "system", content: "You are an expert React developer. Return only the updated code block with no explanation." },
//           { role: "user", content: `Please fix, refactor and rewrite this React component code to be correct, safe, and production-ready. Output only the updated code:\n\n${code}` },
//         ],
//         max_tokens: 2000,
//       },
//       { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" } }
//     );

//     const aiText = resp.data.choices?.[0]?.message?.content || resp.data.choices?.[0]?.text;
//     res.json({ code: aiText });
//   } catch (err) {
//     console.error("AI fix error:", err?.message || err);
//     res.status(500).json({ message: err.message || String(err) });
//   }
// });

// router.post("/components/ai/generate", adminAuth, async (req, res) => {
//   try {
//     const { prompt } = req.body;
//     if (!prompt) return res.status(400).json({ message: "prompt is required" });

//     if (!process.env.OPENAI_API_KEY) {
//       return res.status(501).json({ message: "AI not configured on server (OPENAI_API_KEY missing)" });
//     }

//     const resp = await axios.post(
//       "https://api.openai.com/v1/chat/completions",
//       {
//         model: "gpt-4o-mini",
//         messages: [
//           { role: "system", content: "You are an expert React developer. Return only a self-contained React component in JSX (ESM)." },
//           { role: "user", content: `Generate a React component based on the following description. Include prop definitions when relevant and ensure it can be previewed in a live editor.\n\n${prompt}` },
//         ],
//         max_tokens: 2000,
//       },
//       { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" } }
//     );

//     const aiText = resp.data.choices?.[0]?.message?.content || resp.data.choices?.[0]?.text;
//     res.json({ code: aiText });
//   } catch (err) {
//     console.error("AI generate error:", err?.message || err);
//     res.status(500).json({ message: err.message || String(err) });
//   }
// });
import express from "express";
import axios from "axios";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import Component from "../models/components.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Configure Multer to use Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "sharadUI_assets", // Keeps your UI library assets organized
    allowed_formats: ["jpg", "png", "jpeg", "gif", "svg", "webp"],
  },
});
const upload = multer({ storage: storage });

// 3. Helper to strip Markdown from OpenAI responses
const cleanAICode = (text) => {
  if (!text) return "";
  return text.replace(/^```(jsx|js|javascript|tsx|ts)?\n/i, "").replace(/```$/i, "").trim();
};

// 🔥 Unified Create Component Route (Handles both JSON and Multipart/Files)
router.post(
  "/component",
  adminAuth,
  upload.array("files"),
  async (req, res) => {
    try {
      const { name, label, category, description, template, installSteps, props, type } = req.body;

      if (!name || !category) {
        return res.status(400).json({ message: "Name and category are required" });
      }

      // Cloudinary automatically provides the secure cloud URL in req.files[i].path
      const files = req.files ? req.files.map((f) => f.path) : [];

      // Parse props (FormData sends arrays/objects as strings, so we must parse it)
      let parsedProps = [];
      if (props) {
        try {
          parsedProps = JSON.parse(props);
        } catch (e) {
          // Fallback for legacy comma-separated strings
          parsedProps = props.split(",").map((p) => ({ name: p.trim() }));
        }
      }

      const component = await Component.create({
        name,
        label: label || name,
        category,
        type: type || "frontend",
        description: description || "",
        installSteps: installSteps || "",
        props: parsedProps,
        code: template || "",
        path: `${category}/${name}`,
        files, // Now stores live Cloudinary URLs
      });

      res.status(201).json({
        message: "Component created successfully",
        component,
      });
    } catch (err) {
      console.error("Component creation error:", err);
      res.status(500).json({ message: err.message });
    }
  }
);

// 🔥 JSON-only fallback route (if you send standard JSON without files)
router.post("/components/create", adminAuth, async (req, res) => {
  try {
    const { name, label, category, description, template, installSteps, props } = req.body;

    if (!name || !category) {
      return res.status(400).json({ message: "Name and category are required" });
    }

    const component = await Component.create({
      name,
      label: label || name,
      category,
      description: description || "",
      installSteps: installSteps || "",
      props: props || [],
      code: template || "",
      path: `${category}/${name}`,
      files: [],
    });

    res.status(201).json({ message: "Component created successfully", component });
  } catch (err) {
    console.error("Component creation error:", err);
    res.status(500).json({ message: err.message });
  }
});

// Get all components
router.get("/components", adminAuth, async (req, res) => {
  try {
    const components = await Component.find().sort({ createdAt: -1 }); // Newest first
    res.json(components);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// 🔥 Update Component (Handles text updates & new file uploads)
router.put(
  "/component/:id",
  adminAuth,
  upload.array("files"),
  async (req, res) => {
    try {
      const { name, label, category, description, template, installSteps, props, type } = req.body;

      // 1. Find existing component
      const existingComponent = await Component.findById(req.params.id);
      if (!existingComponent) return res.status(404).json({ message: "Component not found" });

      // 2. Parse props safely
      let parsedProps = existingComponent.props;
      if (props) {
        try {
          parsedProps = typeof props === "string" ? JSON.parse(props) : props;
        } catch (e) {
          parsedProps = props.split(",").map((p) => ({ name: p.trim() }));
        }
      }

      // 3. Handle new files if uploaded (append to existing, or you can replace)
      const newFiles = req.files ? req.files.map((f) => f.path) : [];
      const updatedFiles = [...existingComponent.files, ...newFiles];

      // 4. Update the document
      const updatedComponent = await Component.findByIdAndUpdate(
        req.params.id,
        {
          name: name || existingComponent.name,
          label: label || existingComponent.label,
          category: category || existingComponent.category,
          type: type || existingComponent.type,
          description: description || existingComponent.description,
          installSteps: installSteps !== undefined ? installSteps : existingComponent.installSteps,
          props: parsedProps,
          code: template || existingComponent.code,
          files: updatedFiles,
        },
        { new: true } // Return the updated document
      );

      res.json({ message: "Component updated successfully", component: updatedComponent });
    } catch (err) {
      console.error("Component update error:", err);
      res.status(500).json({ message: err.message });
    }
  }
);
// Delete component
router.delete("/component/:id", adminAuth, async (req, res) => {
  try {
    const component = await Component.findByIdAndDelete(req.params.id);
    res.json({ message: "Component deleted", component });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔥 AI Helpers (Moved ABOVE export default)
router.post("/components/ai/fix", adminAuth, async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ message: "code is required" });

    if (!process.env.OPENAI_API_KEY) {
      return res.status(501).json({ message: "AI not configured on server (OPENAI_API_KEY missing)" });
    }

    const resp = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are an expert React developer. Return ONLY valid JSX code. Do not wrap it in markdown block quotes. Do not provide explanations." },
          { role: "user", content: `Please fix, refactor and rewrite this React component code to be correct, safe, and production-ready. Output only the updated code:\n\n${code}` },
        ],
        max_tokens: 2000,
      },
      { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" } }
    );

    let aiText = resp.data.choices?.[0]?.message?.content || "";
    res.json({ code: cleanAICode(aiText) });
  } catch (err) {
    console.error("AI fix error:", err?.response?.data || err.message);
    res.status(500).json({ message: err.response?.data?.error?.message || err.message });
  }
});

router.post("/components/ai/generate", adminAuth, async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ message: "prompt is required" });

    if (!process.env.OPENAI_API_KEY) {
      return res.status(501).json({ message: "AI not configured on server (OPENAI_API_KEY missing)" });
    }

    const resp = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are an expert React developer. Return ONLY a self-contained React component in JSX (ESM). Do not wrap in markdown quotes." },
          { role: "user", content: `Generate a React component based on the following description. Include prop definitions when relevant and ensure it can be previewed in a live editor.\n\n${prompt}` },
        ],
        max_tokens: 2000,
      },
      { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" } }
    );

    let aiText = resp.data.choices?.[0]?.message?.content || "";
    res.json({ code: cleanAICode(aiText) });
  } catch (err) {
    console.error("AI generate error:", err?.response?.data || err.message);
    res.status(500).json({ message: err.response?.data?.error?.message || err.message });
  }
});

export default router;