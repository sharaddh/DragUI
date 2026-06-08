import {
 useEffect,
 useState
}
from "react";

import {
 Search,
 Plus
}
from "lucide-react";

import {
 Link
}
from "react-router-dom";
import {
 getComponents
}
from "../api/componentApi";
import {
 deleteComponent
}
from "../api/componentApi";

export default function Components(){
    const remove =
async(id)=>{

 if(
  !window.confirm(
   "Delete component?"
  )
 ){
  return;
 }

 await deleteComponent(
  id
 );

 load();

};
const [
  propsData,
  setPropsData
] = useState([]);
 const [
  components,
  setComponents
 ] = useState([]);

 const [
  search,
  setSearch
 ] = useState("");

 useEffect(()=>{

  load();

 },[]);

 const load =
 async()=>{

  const data =
  await getComponents();

  setComponents(
   data.components || []
  );

 };

 const filtered =
 components.filter(
 component=>

 component.name
 .toLowerCase()
 .includes(
  search.toLowerCase()
 )
 );

 return(

 <div className="space-y-6">

  <div className="flex justify-between">

   <div>

    <h1 className="text-3xl font-bold">
     Components
    </h1>

    <p>
     Manage Registry
    </p>

   </div>

   <Link
    to="/components/new"
    className="
    px-4 py-2
    rounded-xl
    bg-black
    text-white
    flex gap-2
    "
   >

    <Plus size={18}/>
    New Component

   </Link>

  </div>

  <div className="relative">

   <Search
    className="
    absolute
    left-3
    top-3
    "
   />

   <input

    value={search}

    onChange={(e)=>
    setSearch(
     e.target.value
    )}

    className="
    w-full
    border
    rounded-xl
    pl-10
    py-3
    "

    placeholder="
    Search Components
    "

   />

  </div>

  <div className="grid gap-4">

   {filtered.map(
    component=>(

     <div

      key={component._id}

      className="
      p-4
      rounded-xl
      border
      bg-white
      flex
      justify-between
      items-center
      "

     >

      <div>

       <h3>
        {component.name}
       </h3>

       <p>
        {component.category}
       </p>

      </div>

      <div>

       {component.status}

      </div>

     </div>

    )
   )}

  </div>

 </div>

 );

}