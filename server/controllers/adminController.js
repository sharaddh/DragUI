import Component from "../models/Component.js";
import Project from "../models/Project.js";
import User from "../models/User.js";

export const dashboard =
async (
  req,
  res
) => {

  try {

    const [
      users,
      projects,
      components,
    ] = await Promise.all([
      User.countDocuments(),
      Project.countDocuments(),
      Component.countDocuments(),
    ]);

    res.json({
      success: true,

      stats: {
        users,
        projects,
        components,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};
import Component from "../models/Component.js";
import Project from "../models/Project.js";
import User from "../models/User.js";

export const dashboard =
async (
  req,
  res
) => {

  try {

    const [
      users,
      projects,
      components,
    ] = await Promise.all([
      User.countDocuments(),
      Project.countDocuments(),
      Component.countDocuments(),
    ]);

    res.json({
      success: true,

      stats: {
        users,
        projects,
        components,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};import Component from "../models/Component.js";
import Project from "../models/Project.js";
import User from "../models/User.js";

export const dashboard =
async (
  req,
  res
) => {

  try {

    const [
      users,
      projects,
      components,
    ] = await Promise.all([
      User.countDocuments(),
      Project.countDocuments(),
      Component.countDocuments(),
    ]);

    res.json({
      success: true,

      stats: {
        users,
        projects,
        components,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};