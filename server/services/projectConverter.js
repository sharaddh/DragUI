export const convertToProject =
(
 aiProject
) => {

 return {

   name:
     aiProject.title,

   description:
     aiProject.description,

   frontend:
     aiProject.generatedData
     .frontend,

   backend:
     aiProject.generatedData
     .backend,

   database:
     aiProject.generatedData
     .database
 };
};