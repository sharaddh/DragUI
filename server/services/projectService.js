import Project from "../models/Project.js";
import crypto from "crypto";
import mongoose from "mongoose";

export const createProject = async (payload, userId) => {
  // Whitelist fields - never create straight from req.body
  const { name, description, type, tags, isPublic, visibility } = payload;
  const project = await Project.create({
    name,
    description,
    type,
    tags: tags || [],
    visibility: visibility || (isPublic ? "public" : "private"),
    owner: userId,
    projectId: crypto.randomBytes(4).toString("hex"),
  });
  return project;
};

const canRead = (project, userId) => {
  if (!project) return false;
  const ownerId = project.owner?._id ? String(project.owner._id) : String(project.owner);
  if (userId && ownerId === String(userId)) return true;
  // Public projects are readable by anyone
  return project.visibility === "public";
};

// Resolve by short projectId first, then by Mongo _id - always access-checked
const resolveProject = async (projectId) => {
  let project = await Project.findOne({ projectId });
  if (!project && mongoose.isValidObjectId(projectId)) {
    project = await Project.findById(projectId);
  }
  return project;
};

export const getProject = async (projectId, userId = null) => {
  const project = await resolveProject(projectId);
  if (!canRead(project, userId)) return null;
  return project;
};

export const listProjects = async (userId) => {
  return Project.find({ owner: userId }).sort({ updatedAt: -1 });
};

export const saveProject = async (userId, { name, design, isPublic, isPublished, description, type, tags, visibility, projectId }) => {
  // Prefer an explicit id so we update the exact project the user opened
  // rather than whichever first project shares the same name.
  let project = projectId
    ? await (async () => {
        let p = await Project.findOne({ owner: userId, projectId });
        if (!p && mongoose.isValidObjectId(projectId)) {
          p = await Project.findOne({ _id: projectId, owner: userId });
        }
        return p;
      })()
    : null;

  if (!project) {
    project = await Project.findOne({ owner: userId, name });
  }

  if (!project) {
    project = await Project.create({
      name,
      design,
      frontend: [design],
      projectId: crypto.randomBytes(4).toString("hex"),
      owner: userId,
      visibility: visibility || (isPublic ? "public" : "private"),
      isPublished: isPublished || false,
      description,
      type: type || "frontend",
      tags: tags || [],
    });
  } else {
    const nextVisibility = visibility || (isPublic ? "public" : project.visibility || "private");
    project.design = design;
    project.frontend = [design];
    project.visibility = nextVisibility;
    project.isPublished = isPublished ?? project.isPublished;
    project.description = description;
    project.type = type || project.type;
    project.tags = tags || project.tags;
    project.updatedAt = new Date();
    await project.save();
  }
  return project;
};

// Owner-scoped only - no unscoped fallbacks
export const deleteProject = async (userId, projectId) => {
  let project = await Project.findOneAndDelete({ owner: userId, projectId });
  if (!project && mongoose.isValidObjectId(projectId)) {
    project = await Project.findOneAndDelete({ _id: projectId, owner: userId });
  }
  return project;
};

// Fields a project owner may update on their own project. Everything else
// (owner, projectId, workspace, isMarketplace, status, counters) is
// protected server-side and cannot be set through this endpoint.
const UPDATABLE = [
  "name",
  "description",
  "design",
  "frontend",
  "backend",
  "tags",
  "type",
  "thumbnail",
  "visibility",
];

// Owner-scoped only - no unscoped fallbacks
export const updateProject = async (userId, projectId, data) => {
  const update = {
    updatedAt: new Date(),
  };
  for (const key of UPDATABLE) {
    if (data[key] !== undefined) update[key] = data[key];
  }
  // Accept the legacy boolean as a way to toggle public/private.
  if (data.isPublic !== undefined) {
    update.visibility = data.isPublic ? "public" : "private";
  }

  const apply = (q) => Project.findOneAndUpdate(q, update, { new: true });
  let project = await apply({ owner: userId, projectId });
  if (!project && mongoose.isValidObjectId(projectId)) {
    project = await apply({ _id: projectId, owner: userId });
  }
  return project;
};
