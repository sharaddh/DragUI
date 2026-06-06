import {
 publishProject
}
from "../services/projectPublisher.js";

import {
 publishMarketplace
}
from "../services/marketplacePublisher.js";

export const publish =
async (
 req,
 res
) => {

 try {

  const project =
   await publishProject(
    req.params.id
   );

  res.json({

   success:true,

   project
  });

 } catch(error){

  res.status(500).json({

   success:false,

   message:
    error.message
  });

 }

};

export const marketplace =
async (
 req,
 res
) => {

 try {

  const project =
   await publishMarketplace(
    req.params.id
   );

  res.json({

   success:true,

   project
  });

 } catch(error){

  res.status(500).json({

   success:false,

   message:
    error.message
  });

 }

};