import Fuse
from "fuse.js";

export default function searchComponents(
 components,
 query
){

 const fuse =
  new Fuse(
   components,
   {
    keys:[
     "name",
     "description",
     "tags"
    ]
   }
  );

 return fuse
 .search(query)
 .map(
  r=>r.item
 );

}