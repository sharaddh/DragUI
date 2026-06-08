import {
 useState
}
from "react";

import MonacoEditor
from "../components/MonacoEditor";

import PreviewPanel
from "../components/PreviewPanel";

import FileExplorer
from "../components/FileExplorer";

import ComponentToolbar
from "../components/ComponentToolbar";
import {
  useState,
  useEffect
} from "react";

import PropertyBuilder
from "../components/PropertyBuilder";

import {
  getComponent,
  createComponent,
  updateComponent
}
from "../api/componentApi";

import toast from "react-hot-toast";
import {
 useParams
}
from "react-router-dom";

export default function ComponentEditor(){

 const [
  files,
  setFiles
 ] = useState([
 {
  name:"Button.jsx",

  code:`
export default function Button(){

 return(

 <button>
  Click
 </button>

 )

}
`
 }
 ]);
const { id } =
 useParams();
 useEffect(()=>{

 if(id){

  loadComponent();

 }

},[id]);
const loadComponent =
 async()=>{

  const data =
   await getComponent(id);

  setFiles([
   {
    name:
     `${data.name}.jsx`,

    code:
     data.code
   }
  ]);

 };
 const [
  selected,
  setSelected
 ] = useState(
 "Button.jsx"
 );

 const current =
 files.find(
 file=>
 file.name===
 selected
 );

 const updateCode =
 code=>{

  setFiles(
   prev=>

   prev.map(
    file=>

    file.name===
    selected

    ? {
      ...file,
      code
     }

    : file
   )
  );

 };

 return(

 <div
 className="
 h-screen
 flex
 flex-col
 "
 >

  <ComponentToolbar/>

  <div
   className="
   flex
   flex-1
   "
  >

   <FileExplorer

    files={files}

    selected={selected}

    setSelected={setSelected}

   />

   <div
   className="
   flex-1
   "
   >

    <MonacoEditor

     code={
      current.code
     }

     setCode={
      updateCode
     }

    />

   </div>

   <div
   className="
   w-[500px]
   border-l
   "
   >

    <PreviewPanel

     code={
      current.code
     }

    />

   </div>

  </div>

 </div>

 );

}