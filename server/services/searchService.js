import Component from "../models/Component.js";

export const searchComponents =
async (
  query,
  filters = {}
) => {

  const mongoQuery = {
    status: "published",
  };

  if (query) {

    mongoQuery.$or = [
      {
        name: {
          $regex: query,
          $options: "i",
        },
      },

      {
        description: {
          $regex: query,
          $options: "i",
        },
      },

      {
        tags: {
          $in: [query],
        },
      },
    ];
  }

  if (filters.type) {
    mongoQuery.type =
      filters.type;
  }

  if (filters.category) {
    mongoQuery.category =
      filters.category;
  }

  return Component.find(
    mongoQuery
  )
    .sort({
      downloads: -1,
      usageCount: -1,
    })
    .limit(50);
};