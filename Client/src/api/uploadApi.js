import api
from "./axios";

export const uploadFile =
async(file)=>{

 const formData =
  new FormData();

 formData.append(
  "file",
  file
 );

 const res =
  await api.post(
   "/upload",
   formData
  );

 return res.data;

};