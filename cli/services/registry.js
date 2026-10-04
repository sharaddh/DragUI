import axios from "axios";

import { API_BASE }
from "../utils/config.js";

const api =
 axios.create({

  baseURL:
   API_BASE

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

   `/search/search/${encodeURIComponent(query)}`

  );

 return res.data;

}
export async function getLatestVersion(
 component
){

 const res =
 await api.get(
  `/registry/manifest/${component}`
 );

 return {
  version: res.data?.manifest?.version ?? null,
  manifest: res.data?.manifest ?? null,
 };
}