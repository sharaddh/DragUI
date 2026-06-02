import express from "express";
import axios from "axios";

import adminAuth from "../middleware/adminAuth.js";
import upload from "../middleware/upload.js";

import Component from "../models/Component.js";
import ComponentVersion from "../models/ComponentVersion.js";
import Asset from "../models/Asset.js";

import * as componentController from "../controllers/componentController.js";

const router = express.Router();

/*
========================================
COMPONENT CRUD
========================================
*/

// Create Component
router.post(
  "/",
  adminAuth,
  componentController.create
);

// Get All Components
router.get(
  "/",
  adminAuth,
  componentController.getAll
);

// Get Single Component
router.get(
  "/:id",
  adminAuth,
  async (req, res) => {
    try {
      const component =
        await Component.findById(
          req.params.id
        );

      if (!component) {
        return res.status(404).json({
          success: false,
          message:
            "Component not found",
        });
      }

      res.json({
        success: true,
        component,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// Update Component
router.put(
  "/:id",
  adminAuth,
  async (req, res) => {
    try {
      const component =
        await Component.findById(
          req.params.id
        );

      if (!component) {
        return res.status(404).json({
          success: false,
          message:
            "Component not found",
        });
      }

      Object.assign(
        component,
        req.body
      );

      await component.save();

      res.json({
        success: true,
        component,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// Delete Component
router.delete(
  "/:id",
  adminAuth,
  async (req, res) => {
    try {
      const component =
        await Component.findByIdAndDelete(
          req.params.id
        );

      if (!component) {
        return res.status(404).json({
          success: false,
          message:
            "Component not found",
        });
      }

      res.json({
        success: true,
        message:
          "Component deleted",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

/*
========================================
VERSIONS
========================================
*/

// Get Component Versions

router.get(
  "/:id/versions",
  adminAuth,
  async (req, res) => {
    try {
      const versions =
        await ComponentVersion.find({
          component:
            req.params.id,
        }).sort({
          createdAt: -1,
        });

      res.json({
        success: true,
        versions,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// Create New Version

router.post(
  "/:id/version",
  adminAuth,
  async (req, res) => {
    try {
      const component =
        await Component.findById(
          req.params.id
        );

      if (!component) {
        return res.status(404).json({
          success: false,
          message:
            "Component not found",
        });
      }

      const version =
        await ComponentVersion.create({
          component:
            component._id,

          version:
            req.body.version,

          template:
            component.code,

          props:
            component.props,

          dependencies:
            component.dependencies,

          changelog:
            req.body.changelog ||
            "",
        });

      res.status(201).json({
        success: true,
        version,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

/*
========================================
ASSET UPLOADS
========================================
*/

// Upload Assets

router.post(
  "/assets/upload",
  adminAuth,
  upload.array("files"),
  async (req, res) => {
    try {
      const assets =
        await Promise.all(
          req.files.map(
            async (file) => {
              return Asset.create({
                name:
                  file.originalname,

                url:
                  file.path,

                publicId:
                  file.filename,

                type:
                  file.mimetype,

                size:
                  file.size,

                uploadedBy:
                  req.adminId,
              });
            }
          )
        );

      res.json({
        success: true,
        assets,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// Get Assets

router.get(
  "/assets",
  adminAuth,
  async (req, res) => {
    try {
      const assets =
        await Asset.find().sort({
          createdAt: -1,
        });

      res.json({
        success: true,
        assets,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

/*
========================================
AI GENERATION
========================================
*/

const cleanAICode = (text) => {
  if (!text) return "";

  return text
    .replace(
      /^```(jsx|js|tsx|ts)?\n/i,
      ""
    )
    .replace(/```$/i, "")
    .trim();
};

// Generate Component

router.post(
  "/ai/generate",
  adminAuth,
  async (req, res) => {
    try {
      const { prompt } =
        req.body;

      const response =
        await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model:
              "gpt-4o-mini",

            messages: [
              {
                role: "system",
                content:
                  "Generate production ready React JSX component. Return only JSX code.",
              },
              {
                role: "user",
                content:
                  prompt,
              },
            ],
          },
          {
            headers: {
              Authorization:
                `Bearer ${process.env.OPENAI_API_KEY}`,
            },
          }
        );

      const code =
        cleanAICode(
          response.data.choices?.[0]
            ?.message?.content
        );

      res.json({
        success: true,
        code,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);
router.post(
 "/:id/clone",
 adminAuth,
 async (
   req,
   res
 ) => {

   const component =
     await Component.findById(
       req.params.id
     );

   if(!component){
     return res.status(404)
       .json({
         success:false
       });
   }

   const clone =
     await Component.create({

       ...component.toObject(),

       _id:undefined,

       name:
         component.name +
         " Copy",

       slug:
         component.slug +
         "-copy"
     });

   res.json({
     success:true,
     clone
   });

 }
);
router.patch(
 "/:id/publish",
 adminAuth,
 async (
   req,
   res
 ) => {

   const component =
     await Component.findByIdAndUpdate(
       req.params.id,
       {
         status:
           "published"
       },
       {
         new:true
       }
     );

   res.json({
     success:true,
     component
   });

 }
);
router.patch(
 "/:id/draft",
 adminAuth,
 async (
   req,
   res
 ) => {

   const component =
     await Component.findByIdAndUpdate(
       req.params.id,
       {
         status:
           "draft"
       },
       {
         new:true
       }
     );

   res.json({
     success:true,
     component
   });

 }
);
// Fix Component
router.get(
 "/search",
 adminAuth,
 async (
   req,
   res
 ) => {

   const {
     q=""
   } = req.query;

   const components =
     await Component.find({
       name:{
         $regex:q,
         $options:"i"
       }
     });

   res.json({
     success:true,
     components
   });

 }
);
router.post(
  "/ai/fix",
  adminAuth,
  async (req, res) => {
    try {
      const { code } =
        req.body;

      const response =
        await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model:
              "gpt-4o-mini",

            messages: [
              {
                role: "system",
                content:
                  "Fix React component and return only code.",
              },
              {
                role: "user",
                content:
                  code,
              },
            ],
          },
          {
            headers: {
              Authorization:
                `Bearer ${process.env.OPENAI_API_KEY}`,
            },
          }
        );

      const fixedCode =
        cleanAICode(
          response.data.choices?.[0]
            ?.message?.content
        );

      res.json({
        success: true,
        code: fixedCode,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

export default router;