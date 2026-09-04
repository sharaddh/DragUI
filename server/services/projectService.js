import Project from "../models/Project.js";
import crypto from "crypto";
import mongoose from "mongoose";

export const createProject = async (payload, userId) => {
  const cleaned = sanitizeProjectInput(payload);
  const project = await Project.create({
    name: cleaned.name,
    description: cleaned.description,
    type: cleaned.type,
    tags: cleaned.tags,
    visibility: cleaned.visibility || (cleaned.isPublic ? "public" : "private"),
    owner: userId,
    projectId: crypto.randomBytes(4).toString("hex"),
  });
  return project;
};

const MAX_NAME_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 2000;
const MAX_TAGS = 50;

const sanitizeProjectInput = (payload) => {
  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  if (!name) throw new Error("Project name is required");
  if (name.length > MAX_NAME_LENGTH) {
    throw new Error(`Project name must be at most ${MAX_NAME_LENGTH} characters`);
  }

  let description = payload.description;
  if (typeof description === "string") {
    description = description.trim();
    if (description.length > MAX_DESCRIPTION_LENGTH) {
      throw new Error(`Project description must be at most ${MAX_DESCRIPTION_LENGTH} characters`);
    }
  }

  const tags = Array.isArray(payload.tags)
    ? payload.tags.slice(0, MAX_TAGS).map((t) => String(t).slice(0, 50))
    : (payload.tags || []);

  return { ...payload, name, description, tags };
};

const canRead = (project, userId) => {
  if (!project) return false;
  if (!project.owner) return project.visibility === "public";
  const ownerId = project.owner._id ? String(project.owner._id) : String(project.owner);
  if (userId && ownerId === String(userId)) return true;
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
  return Project.find({ owner: userId }).sort({ updatedAt: -1, createdAt: -1 });
};

export const saveProject = async (userId, { name, design, isPublic, isPublished, description, type, tags, visibility, projectId }) => {
  const cleaned = sanitizeProjectInput({ name, design, isPublic, isPublished, description, type, tags, visibility });
  name = cleaned.name;
  description = cleaned.description;
  tags = cleaned.tags;
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
