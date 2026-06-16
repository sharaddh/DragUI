import axios from "axios";

const api =
 axios.create({

  baseURL:
   process.env.DROPUI_API ||

   "http://localhost:5000/api"

 });

export async function getManifest(
 component
) {

 const res =
  await api.get(

   `/registry/manifest/${component}`

  );

 return res.data;

}

export async function searchComponents(
 query
) {

 const res =
  await api.get(

   `/registry/search/${query}`

  );

 return res.data;

}
export async function getLatestVersion(
 component
){

 const res =
 await api.get(
  `/registry/version/${component}`
 );

 return res.data;
}