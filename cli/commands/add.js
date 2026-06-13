import api
from "../utils/api.js";

export default async function add(

 component

){

 const result =
 await api.get(

  `/registry/${component}`

 );

 console.log(

  result.data

 );

}