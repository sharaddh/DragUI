const REGEX =
/process\.env\.([A-Z0-9_]+)/g;

export default function extractEnvVariables(
 code
){

 const envs = [];

 let match;

 while(
   (
     match =
       REGEX.exec(code)
   ) !== null
 ){

   envs.push(
     match[1]
   );

 }

 return [
   ...new Set(envs)
 ];

}