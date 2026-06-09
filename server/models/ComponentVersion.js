import mongoose from "mongoose";

const schema =
  new mongoose.Schema({

    componentId: {
      type:
        mongoose.Schema.Types.ObjectId,

      ref:
        "Component"
    },

    version: String,

    code: String,

    props: Array,

    changelog: String,

    createdAt: {
      type: Date,
      default: Date.now
    }
    ,

    template: String,


    dependencies: [String],

  },
    {
      timestamps: true,

    });

export default
  mongoose.models.ComponentVersion ||

  mongoose.model(
    "ComponentVersion",
    schema
  );