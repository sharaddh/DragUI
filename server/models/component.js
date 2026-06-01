import mongoose from "mongoose";

const propSchema = new mongoose.Schema(
{
  name: String,
  label: String,

  type: {
    type: String,
    enum: [
      "text",
      "number",
      "color",
      "boolean",
      "select",
      "image",
      "url"
    ]
  },

  defaultValue: mongoose.Schema.Types.Mixed,

  required: {
    type: Boolean,
    default: false
  },

  options: [String]
},
{ _id:false }
);

const componentSchema = new mongoose.Schema(
{
  name:{
    type:String,
    required:true,
    unique:true
  },

  slug:{
    type:String,
    unique:true
  },

  label:String,

  description:String,

  type:{
    type:String,
    enum:["frontend","backend"],
    required:true
  },

  category:String,

  tags:[String],

  version:{
    type:String,
    default:"1.0.0"
  },

  visibility:{
    type:String,
    enum:["public","private"],
    default:"public"
  },

  status:{
    type:String,
    enum:[
      "draft",
      "published",
      "deprecated"
    ],
    default:"published"
  },

  template:String,

  props:[propSchema],

  files:[
    {
      name:String,
      url:String,
      publicId:String,
      size:Number,
      type:String
    }
  ],

  thumbnail:String,

  dependencies:[String],

  peerDependencies:[String],

  envVariables:[String],

  downloads:{
    type:Number,
    default:0
  },

  usageCount:{
    type:Number,
    default:0
  },

  createdBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Admin"
  }

},
{
  timestamps:true
});

export default mongoose.model(
  "Component",
  componentSchema
);