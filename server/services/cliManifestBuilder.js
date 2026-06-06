export const buildCliManifest =
(
 project
) => {

 return {

  projectId:
   project.projectId,

  name:
   project.name,

  version:
   project.version,

  dependencies:
   project.dependencies || [],

  peerDependencies:
   project.peerDependencies || [],

  envVariables:
   project.envVariables || [],

  files:
   project.files || []
 };
};