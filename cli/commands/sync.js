import axios from "axios";

export default async function sync(){

 const res =
  await axios.get(

   "http://localhost:5000/api/registry"

  );

 console.log(

  `${res.data.components.length}
   components synced`

 );

}