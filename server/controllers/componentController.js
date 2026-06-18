import Component from "../models/Component.js";
import ComponentVersion from "../models/ComponentVersion.js";
import * as componentService from "../services/componentService.js";
import ComponentManifest
from "../models/ComponentManifest.js";
import slugify from "slugify";
import extractProps from "../utils/extractProps.js";
import extractDependencies from "../utils/extractDependencies.js";
import { saveTemplate } from "../services/templateService.js";
import { renderThumbnail } from "../services/renderThumbnail.js"; // Adjust path if necessary!
/*
/*
=====================================
CREATE COMPONENT
=====================================
*/
export const create = async (req, res) => {
  try {
    const component = await componentService.createComponent(
      req.body,
      req.adminId
    );

    res.status(201).json({
      success: true,
      component,
    });
  } catch (error) {
    // 👇 THIS IS THE MAGIC LINE. It will print the exact MongoDB rejection!
    console.error("🔥 CREATE COMPONENT ERROR:", error); 

    res.status(500).json({
      success: false,
      message: error.message || "An unknown server error occurred",
    });
  }
};

/*
=====================================
GET ALL COMPONENTS
=====================================
*/

export const getAll = async (req, res) => {
  try {
    const page =
      Number(req.query.page) || 1;

    const limit =
      Number(req.query.limit) || 20;

    const skip =
      (page - 1) * limit;

    const total =
      await Component.countDocuments();

    const components =
      await Component.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    res.json({
      success: true,

      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(
          total / limit
        ),
      },

      components,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
=====================================
GET SINGLE COMPONENT
=====================================
*/

export const getById = async (
  req,
  res
) => {
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
};

/*
=====================================
SEARCH
=====================================
*/

export const search = async (
  req,
  res
) => {
  try {
    const {
      q = "",
      category,
      type,
      status,
    } = req.query;

    const query = {};

    if (q) {
      query.$or = [
        {
          name: {
            $regex: q,
            $options: "i",
          },
        },
        {
          label: {
            $regex: q,
            $options: "i",
          },
        },
      ];
    }

    if (category)
      query.category = category;

    if (type)
      query.type = type;

    if (status)
      query.status = status;

    const components =
      await Component.find(query)
        .sort({
          createdAt: -1,
        });

    res.json({
      success: true,
      components,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
=====================================
UPDATE
=====================================
*/
/*
=====================================
UPDATE COMPONENT
=====================================
*/
export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, category, type, description } = req.body;

    const existingComponent = await Component.findById(id);
    if (!existingComponent) return res.status(404).json({ success: false, message: "Not found" });

    let updatedTemplatePath = existingComponent.template;
    let newSlug = existingComponent.slug;

    if (name) newSlug = slugify(name, { lower: true });

    if (code) {
      const template = await saveTemplate({
        type: type || existingComponent.type || "components",
        slug: newSlug,
        code,
        name: name || existingComponent.name
      });
      updatedTemplatePath = template.path;
    }

    const updatedProps = code ? extractProps(code) : existingComponent.props;
    const updatedDependencies = code ? extractDependencies(code) : existingComponent.dependencies;

    // 1. Update the database
    const updatedComponent = await Component.findByIdAndUpdate(
      id,
      {
        ...req.body,
        slug: newSlug,
        template: updatedTemplatePath,
        props: updatedProps,
        dependencies: updatedDependencies,
      },
      { returnDocument: 'after' }
    );

    // 🌟 2. BRUTE-FORCE THUMBNAIL GENERATOR 🌟
    console.log("📸 Forcing thumbnail generation for:", name);
    
    if (code) {  // <-- WE CHANGED THIS LINE to force it to run!
      try {
        const thumbnail = await renderThumbnail(updatedComponent);
        console.log("🖼️ Thumbnail Result from Service:", thumbnail); 
        
        if (thumbnail && thumbnail.url) {
          updatedComponent.thumbnail = thumbnail.url;
          updatedComponent.thumbnailPublicId = thumbnail.publicId;
          await updatedComponent.save();
          console.log("✅ Thumbnail saved to database successfully!");
        } else {
          console.log("❌ renderThumbnail finished, but returned no URL.");
        }
      } catch (thumbError) {
        console.error("⚠️ Thumbnail generation CRASHED:", thumbError);
      }
    }

    res.json({
      success: true,
      component: updatedComponent,
    });
  } catch (error) {
    console.error("🔥 UPDATE COMPONENT ERROR:", error);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Another component with this name already exists." });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};
/*
=====================================
DELETE
=====================================
*/

export const remove = async (
  req,
  res
) => {
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
};

/*
=====================================
CLONE COMPONENT
=====================================
*/

export const clone = async (
  req,
  res
) => {
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

    const clone =
      await Component.create({
        ...component.toObject(),

        _id: undefined,

        name:
          component.name +
          " Copy",

        slug:
          component.slug +
          "-copy-" +
          Date.now(),

        status: "draft",
      });

    res.json({
      success: true,
      clone,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
=====================================
PUBLISH
=====================================
*/

export const publish = async (
  req,
  res
) => {
  try {
    const component =
      await Component.findByIdAndUpdate(
        req.params.id,
        {
          status:
            "published",
        },
        {
          new: true,
        }
      );

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
};

/*
=====================================
DRAFT
=====================================
*/

export const draft = async (
  req,
  res
) => {
  try {
    const component =
      await Component.findByIdAndUpdate(
        req.params.id,
        {
          status: "draft",
        },
        {
          new: true,
        }
      );

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
};

/*
=====================================
VERSIONS
=====================================
*/

export const getVersions =
  async (req, res) => {
    try {
      const versions =
        await ComponentVersion.find(
          {
            component:
              req.params.id,
          }
        ).sort({
          createdAt: -1,
        });

      res.json({
        success: true,
        versions,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };
  export const getHealth =
async (
 req,
 res
) => {

 try {

   const manifest =
     await ComponentManifest.findOne({
       component:
         req.params.id
     });

   res.json({
     success:true,
     manifest
   });

 } catch(error){

   res.status(500).json({
     success:false,
     message:error.message
   });

 }

};

export const publishComponent =
async(
 req,
 res
)=>{

 try{

  const component =
   await Component.findById(
    req.params.id
   );

  if(!component){

   return res.status(404)
   .json({
    message:
    "Component not found"
   });

  }

  component.status =
   "published";

  await component.save();

  res.json({
   success:true,
   component
  });

 }catch(error){

  res.status(500).json({
   message:
   error.message
  });

 }

};