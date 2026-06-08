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