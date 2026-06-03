import mongoose from "mongoose";

const componentManifestSchema =
new mongoose.Schema(
{
  component: {
    type:
      mongoose.Schema.Types.ObjectId,
    ref:"Component",
    required:true
  },

  dependencies:[String],

  peerDependencies:[String],

  envVariables:[String],

  exports:[String],

  files:[String],

  thumbnail:String,

  qualityScore:{
    type:Number,
    default:0
  },

  health:{
    hasProps:Boolean,
    hasThumbnail:Boolean,
    hasDescription:Boolean,
    hasDependencies:Boolean,
    hasVersion:Boolean
  }
},
{
  timestamps:true
}
);

export default mongoose.model(
  "ComponentManifest",
  componentManifestSchema
);