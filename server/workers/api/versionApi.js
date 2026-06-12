import api from "./axios";

export const createVersion =
async(
 componentId,
 changelog
)=>{

 const res =
  await api.post(
   `/versions/${componentId}`,
   {
    changelog
   }
  );

 return res.data;

};