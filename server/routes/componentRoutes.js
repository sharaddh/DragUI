import * as componentService from "../services/componentService.js";

export const create = async (
  req,
  res
) => {
  try {
    const component =
      await componentService.createComponent(
        req.body,
        req.adminId
      );

    res.status(201).json(component);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAll = async (
  req,
  res
) => {
  try {
    const components =
      await Component.find()
        .select(
          "name label category type thumbnail version downloads"
        )
        .lean();

    res.json(components);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};