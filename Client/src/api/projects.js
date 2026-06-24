import API from "./index";

export const saveProject = (data) =>
  API.post("/projects/save", data);

export const getProjects = () =>
  API.get("/projects/list");

export const getProject = (projectId) =>
  API.get(`/projects/${projectId}`);

export const deleteProject = (projectId) =>
  API.delete(`/projects/${projectId}`);

export const updateProject = (projectId, data) =>
  API.put(`/projects/${projectId}`, data);