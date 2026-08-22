import Component from "../models/Component.js";
import Project from "../models/Project.js";
import Asset from "../models/Asset.js";
import User from "../models/User.js";
import ComponentAnalytics from "../models/ComponentAnalytics.js";

export const getDashboardStats =
  async () => {

    const componentViews =
      await ComponentAnalytics.aggregate([
        {
          $group: {
            _id: null,
            total: {
              $sum: "$views"
            }
          }
        }
      ]);

    const [
      components,
      projects,
      users,
      assets,
      frontend,
      backend
    ] = await Promise.all([
      Component.countDocuments(),
      Project.countDocuments(),
      User.countDocuments(),
      Asset.countDocuments(),

      Component.countDocuments({
        type: "frontend"
      }),

      Component.countDocuments({
        type: "backend"
      })
    ]);

    const downloads =
      await Component.aggregate([
        {
          $group: {
            _id: null,
            total: {
              $sum: "$downloads"
            }
          }
        }
      ]);

    return {
      components,
      projects,
      users,
      views:
        componentViews[0]?.total || 0,
      assets,
      frontend,
      backend,

      downloads:
        downloads[0]?.total || 0
    };
  };