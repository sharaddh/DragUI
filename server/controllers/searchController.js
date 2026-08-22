import Component from "../models/Component.js";
import searchComponents from '../services/searchService.js';

export const search =
async (
  req,
  res
) => {

  try {

    const {
      q,
      type,
      category,
    } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "q query parameter is required",
      });
    }

    // Only search published components publicly; service signature is (components, query)
    const filters = { status: "published" };
    if (type) filters.type = type;
    if (category) filters.category = category;

    const dataset =
      await Component.find(filters).lean();

    const results =
      searchComponents(
        dataset,
        q
      );

    res.json({
      success: true,
      count: results.length,
      results,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message:
        error.message,
    });

  }

};
