import Project from "../models/Project.js";

export const pullProject =
async (
  req,
  res
) => {

  try {

    const project =
      await Project.findOne({
        projectId:
          req.params.projectId
      });

    if (!project) {
      return res.status(404).json({
        success: false,
        message:
          "Project not found"
      });
    }

    res.json({
      success: true,
      project
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message:
        error.message
    });

  }

};