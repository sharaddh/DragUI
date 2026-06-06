import Project from "../models/Project.js";

export const publishProject =
async (
  projectId
) => {

  const project =
    await Project.findById(
      projectId
    );

  if (!project) {
    throw new Error(
      "Project not found"
    );
  }

  project.status =
    "published";

  project.publishedAt =
    new Date();

  await project.save();

  return project;
};