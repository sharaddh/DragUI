import Project from "../models/Project.js";

export const createProject =
async (
 payload,
 userId
) => {

 const project =
   await Project.create({
     ...payload,
     owner:userId
   });

 return project;
};

export const getProject =
async (
 projectId
) => {

 return Project.findOne({
   projectId
 });

};