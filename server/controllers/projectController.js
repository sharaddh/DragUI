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
    // userId is undefined for anonymous requests - public projects remain viewable
    const project = await projectService.getProject(
      req.params.projectId,
      req.userId
    );
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

function isValidDesign(design) {
  if (!design || typeof design !== "object" || Array.isArray(design)) return false;
  if (design.type !== "root") return false;
  if (!Array.isArray(design.children)) return false;
  // Every child must at least carry a type and its own children bucket
  return design.children.every(
    (node) => node && typeof node === "object" && typeof node.type === "string"
  );
}

export const save = async (req, res) => {
  try {
    const { name, design } = req.body;

    if (!name || !String(name).trim()) {
      return res.status(400).json({ success: false, message: "Project name is required" });
    }

    if (!isValidDesign(design)) {
      return res.status(400).json({
        success: false,
        message: "Invalid design payload: expected a root node with children",
      });
    }

    const project = await projectService.saveProject(req.userId, req.body);
    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const deleted = await projectService.deleteProject(req.userId, req.params.projectId);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const project = await projectService.updateProject(req.userId, req.params.projectId, req.body);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }
    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};