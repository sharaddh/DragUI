import {
  getRecommendations,
  getPopularComponents,
} from "../services/recommendationService.js";

export const recommendations =
async (
  req,
  res
) => {

  try {

    const data =
      await getRecommendations(
        req.params.id
      );

    res.json({
      success: true,
      recommendations: data,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message:
        error.message,
    });

  }

};

export const popular =
async (
  req,
  res
) => {

  try {

    const data =
      await getPopularComponents();

    res.json({
      success: true,
      components: data,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message:
        error.message,
    });

  }

};