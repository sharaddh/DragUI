import Project from "../models/Project.js";
import crypto from "crypto";
import mongoose from "mongoose";

export const createProject = async (payload, userId) => {
  // Whitelist fields - never create straight from req.body
  const { name, description, type, tags, isPublic } = payload;
  const project = await Project.create({
    name,
    description,
    type,
    tags: tags || [],
    isPublic: isPublic || false,
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
  return project.visibility === "public" || project.isPublic === true;
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

export const saveProject = async (userId, { name, design, isPublic, isPublished, description, type, tags }) => {
  let project = await Project.findOne({ owner: userId, name });

  if (!project) {
    project = await Project.create({
      name,
      design,
      frontend: [design],
      projectId: crypto.randomBytes(4).toString("hex"),
      owner: userId,
      isPublic: isPublic || false,
      isPublished: isPublished || false,
      description,
      type: type || "frontend",
      tags: tags || [],
    });
  } else {
    project.design = design;
    project.frontend = [design];
    project.isPublic = isPublic || false;
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

// Owner-scoped only - no unscoped fallbacks
export const updateProject = async (userId, projectId, data) => {
  let project = await Project.findOneAndUpdate(
    { owner: userId, projectId },
    { ...data, updatedAt: new Date() },
    { new: true }
  );
  if (!project && mongoose.isValidObjectId(projectId)) {
    project = await Project.findOneAndUpdate(
      { _id: projectId, owner: userId },
      { ...data, updatedAt: new Date() },
      { new: true }
    );
  }
  return project;
};
