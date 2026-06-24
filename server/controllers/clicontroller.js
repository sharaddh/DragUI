import Project from "../models/Project.js";

export const publishPackage =
async(req,res)=>{

 try{

  const component =
   await Component.create(
    req.body
   );

  res.json({

   success:true,

   component

  });

 }catch(error){

  res.status(500).json({

   success:false,

   message:error.message

  });

 }

};
export const pullProject =
async (
  req,
  res
) => {

  try {

    const id = req.params.projectId;
    let project =
      await Project.findOne({
        projectId: id
      });
    if (!project) {
      project = await Project.findById(id);
    }

    if (!project) {
      return res.status(404).json({
        success: false,
        message:
          "Project not found"
      });
    }

    res.json({
      success: true,
      project
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message:
        error.message
    });

  }

};