import api from "./axios";

export const createVersion =
async(
 componentId,
 changelog,
 code
)=>{

 const res =
  await api.post(
   `/versions/${componentId}`,
   {
    changelog,
    code
   }
  );

 return res.data;

};
