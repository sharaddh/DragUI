import api
from "./axios";

export const getActivity =
async()=>{

 const res =
  await api.get(
   "/activity"
  );

 return res.data;

};

export const getPresence =
async()=>{

 const res =
  await api.get(
   "/presence"
  );

 return res.data;

};