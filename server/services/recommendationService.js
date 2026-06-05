import Component from "../models/Component.js";

export const getRecommendations = async (
  componentId,
  limit = 8
) => {

  const component =
    await Component.findById(
      componentId
    );

  if (!component) {
    return [];
  }

  const recommendations =
    await Component.find({
      _id: {
        $ne: component._id,
      },

      $or: [
        {
          category:
            component.category,
        },

        {
          tags: {
            $in:
              component.tags || [],
          },
        },
      ],
    })
      .sort({
        downloads: -1,
        usageCount: -1,
      })
      .limit(limit);

  return recommendations;
};

export const getPopularComponents =
async (
  limit = 20
) => {

  return Component.find({
    status: "published",
  })
    .sort({
      downloads: -1,
      usageCount: -1,
    })
    .limit(limit);

};