import {
 Save,
 Upload,
 Rocket
}
from "lucide-react";

export default function ComponentToolbar(){

 return(

 <div
 className="
 h-14
 border-b
 flex
 items-center
 px-4
 gap-4
 "
 >

  <button
  className="
  flex
  gap-2
  "
  >

   <Save size={18}/>
   Save

  </button>

  <button
  className="
  flex
  gap-2
  "
  >

   <Upload size={18}/>
   Version

  </button>

  <button
  className="
  flex
  gap-2
  text-green-500
  "
  >

   <Rocket size={18}/>
   Publish

  </button>

 </div>

 );

}