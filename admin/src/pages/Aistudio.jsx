import {
 useState
}
from "react";

import {
 generateAIComponent
}
from "../api/aiApi";

export default function AIStudio(){

 const [
  prompt,
  setPrompt
 ] = useState("");

 const [
  loading,
  setLoading
 ] = useState(false);

 const generate =
 async()=>{

  setLoading(true);

  try{

   const result =
    await generateAIComponent(
     prompt
    );

   console.log(
    result
   );

  }finally{

   setLoading(false);

  }

 };

 return(

 <div
 className="
 max-w-4xl
 mx-auto
 "
 >

  <h1
   className="
   text-3xl
   font-bold
   mb-6
   "
  >
   AI Studio
  </h1>

  <textarea

   value={prompt}

   onChange={(e)=>
   setPrompt(
    e.target.value
   )}

   rows={10}

   className="
   w-full
   border
   rounded-xl
   p-4
   "

   placeholder="
   Create a glassmorphism pricing section with 3 plans...
   "

  />

  <button

   onClick={generate}

   disabled={loading}

   className="
   mt-4
   px-5
   py-3
   rounded-xl
   bg-black
   text-white
   "
  >

   {
    loading
    ? "Generating..."
    : "Generate Component"
   }

  </button>

 </div>

 );

}