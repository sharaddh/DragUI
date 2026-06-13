import add
from "./add.js";

export default async function update(

 component

){

 await add(
  component
 );

 console.log(
  "Updated"
 );

}