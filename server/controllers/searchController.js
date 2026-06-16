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

    const results =
      await searchComponents(
        q,
        {
          type,
          category,
        }
      );

    res.json({
      success: true,
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