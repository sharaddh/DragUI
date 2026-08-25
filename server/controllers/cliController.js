import Project from "../models/Project.js";
import Component from "../models/Component.js";
import User from "../models/User.js";
import Admin from "../models/Admin.js";
import slugify from "slugify";

export const publishPackage =
async(req,res)=>{

 try{

  // Whitelist incoming fields - never create straight from req.body
  const {
    name,
    type,
    category,
    description,
    tags,
    code,
    files,
  } = req.body;

  if (!name || !code) {
    return res.status(400).json({
      success:false,
      message:"name and code are required"
    });
  }

  const component =
   await Component.create({
    name,
    type: type || "frontend",
    category: category || "UI",
    description: description || "",
    tags: Array.isArray(tags) ? tags : [],
    code,
    files: Array.isArray(files)
      ? files.filter(f => f && typeof f.path === "string" && typeof f.content === "string")
      : [],
    slug: slugify(name, { lower: true, strict: true }),
    status: "draft",
    createdBy: req.adminId,
   });

  res.json({

   success:true,

   component

  });

 }catch(error){

  if (error.code === 11000) {
    return res.status(409).json({
      success:false,
      message:"A component with this name already exists"
    });
  }

  res.status(500).json({

   success:false,

   message:error.message

  });

 }

};

// Authenticated via requireAnyAuth.
// Returns the caller's identity so the CLI can greet/verify in one call.
export const me = async (req, res) => {
  try {
    if (req.adminId) {
      const admin = await Admin.findById(req.adminId).select("adminId isActive");
      return res.json({ success: true, role: "admin", admin });
    }

    const user = await User.findById(req.userId).select("email username");
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    res.json({ success: true, role: "user", user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Authenticated via requireAnyAuth (see routes):
// - admins may pull any project by its public id
// - users may only pull their own projects
export const pullProject =
async (
  req,
  res
) => {

  try {

    const id = req.params.projectId;
    const query = { projectId: id };
    if (!req.adminId) {
      query.owner = req.userId;
    }

    let project =
      await Project.findOne(query);

    if (!project) {
      return res.status(404).json({
        success: false,
        message:
          "Project not found"
      });
    }

    res.json({
      success: true,
      project
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message:
        error.message
    });

  }

};
