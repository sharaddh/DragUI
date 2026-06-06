export const generateEnvFile =
(envVariables=[]) => {

 return envVariables
 .map(
  (
   variable
  ) => `${variable}=`
 )
 .join("\n");

};