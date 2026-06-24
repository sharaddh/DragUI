import * as projectService from "../services/projectService.js";

export const create = async (req, res) => {
  try {
    const project = await projectService.createProject(req.body, req.userId);
    res.status(201).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOne = async (req, res) => {
  try {
    const project = await projectService.getProject(req.params.projectId);
    if (!project) {
      return res.status(404).json({ success: false });
    }
    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const list = async (req, res) => {
  try {
    const projects = await projectService.listProjects(req.userId);
    res.json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const save = async (req, res) => {
  try {
    const project = await projectService.saveProject(req.userId, req.body);
    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    await projectService.deleteProject(req.userId, req.params.projectId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const project = await projectService.updateProject(req.userId, req.params.projectId, req.body);
    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};