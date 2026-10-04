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

 if (
  !res.data?.manifest
 ) {
  throw new Error(
   `${component} not found in registry`
  );
 }

 return res.data.manifest;

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