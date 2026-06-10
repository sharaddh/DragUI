import {
 useState
}
from "react";

export default function VersionModal({
 open,
 onClose,
 onSave
}){

 const [
  changelog,
  setChangelog
 ] = useState("");

 if(!open){
  return null;
 }

 return(

 <div
 className="
 fixed
 inset-0
 bg-black/50
 flex
 items-center
 justify-center
 "
 >

  <div
   className="
   bg-white
   p-6
   rounded-2xl
   w-[500px]
   "
  >

   <h2
    className="
    text-xl
    font-semibold
    mb-4
    "
   >
    Create Version
   </h2>

   <textarea

    value={changelog}

    onChange={(e)=>
    setChangelog(
     e.target.value
    )
    }

    rows={6}

    className="
    w-full
    border
    rounded-xl
    p-3
    "

   />

   <div
    className="
    flex
    justify-end
    gap-3
    mt-4
    "
   >

    <button
     onClick={onClose}
    >
     Cancel
    </button>

    <button

     onClick={()=>
     onSave(
      changelog
     )
     }

     className="
     px-4
     py-2
     rounded-lg
     bg-black
     text-white
     "
    >
     Save
    </button>

   </div>

  </div>

 </div>

 );

}