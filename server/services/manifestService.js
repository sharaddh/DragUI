import ComponentManifest
from "../models/ComponentManifest.js";

import extractEnvVariables
from "../utils/extractEnvVariables.js";

import calculateQuality
from "../utils/calculateQuality.js";

export const buildManifest =
async (
 component
) => {

 const envVariables =
   extractEnvVariables(
     component.code
   );

 const qualityScore =
   calculateQuality(
     component
   );

 const manifest =
     await ComponentManifest.findOneAndUpdate(
       {
         component:
           component._id
       },
       {
         component:
           component._id,

         dependencies:
           component.dependencies,

         peerDependencies:
           component.peerDependencies,

         envVariables,

         files:
           component.files,

         thumbnail:
           component.thumbnail,

         qualityScore,

         health: {

           hasProps:
             component.props?.length > 0,

           hasThumbnail:
             !!component.thumbnail,

           hasDescription:
             !!component.description,

           hasDependencies:
             component.dependencies?.length > 0,

           hasVersion:
             !!component.version
         }
       },
       {
         upsert:true,
         new:true
       }
     );

 return manifest;
};