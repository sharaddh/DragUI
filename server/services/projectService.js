import Project from "../models/Project.js";
import crypto from "crypto";

export const createProject = async (payload, userId) => {
  const project = await Project.create({ ...payload, owner: userId });
  return project;
};

export const getProject = async (projectId) => {
  let project = await Project.findOne({ projectId });
  if (!project) {
    project = await Project.findById(projectId);
  }
  return project;
};

export const listProjects = async (userId) => {
  return Project.find({ owner: userId }).sort({ updatedAt: -1 });
};

export const saveProject = async (userId, { name, design, isPublic, description, type, tags }) => {
  let project = await Project.findOne({ owner: userId, name });
  
  if (!project) {
    project = await Project.create({
      name,
      design,
      frontend: [design],
      projectId: crypto.randomBytes(4).toString("hex"),
      owner: userId,
      isPublic: isPublic || false,
      description,
      type: type || "frontend",
      tags: tags || [],
    });
  } else {
    project.design = design;
    project.frontend = [design];
    project.isPublic = isPublic || false;
    project.description = description;
    project.type = type || project.type;
    project.tags = tags || project.tags;
    project.updatedAt = new Date();
    await project.save();
  }
  return project;
};

export const deleteProject = async (userId, projectId) => {
  let project = await Project.findOneAndDelete({ owner: userId, projectId });
  if (!project) {
    project = await Project.findByIdAndDelete(projectId);
  }
  return project;
};

export const updateProject = async (userId, projectId, data) => {
  let project = await Project.findOneAndUpdate(
    { owner: userId, projectId },
    { ...data, updatedAt: new Date() },
    { new: true }
  );
  if (!project) {
    project = await Project.findByIdAndUpdate(projectId, { ...data, updatedAt: new Date() }, { new: true });
  }
  return project;
};