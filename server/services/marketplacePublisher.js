import Project
from "../models/Project.js";

export const publishMarketplace =
async (
 projectId
) => {

 const project =
 await Project.findById(
  projectId
 );

 project.isMarketplace =
 true;

 project.visibility =
 "public";

 await project.save();

 return project;
};