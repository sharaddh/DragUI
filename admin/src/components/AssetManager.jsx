import {
 uploadFile
}
from "../api/uploadApi";

export default function AssetManager({
 assets,
 setAssets
}){

 const upload =
 async(e)=>{

  const file =
   e.target.files[0];

  if(!file) return;

  const result =
   await uploadFile(
    file
   );

  setAssets([
   ...assets,

   {
    name:file.name,

    url:
     result.url,

    type:
     file.type
   }
  ]);

 };

 return(

 <div
 className="
 space-y-4
 "
 >

  <input
   type="file"
   onChange={upload}
  />

  <div
   className="
   grid
   grid-cols-2
   gap-3
   "
  >

   {assets.map(
    asset=>(

     <div

      key={asset.url}

      className="
      border
      rounded-lg
      p-2
      "

     >

      <img

       src={
        asset.url
       }

       alt=""

       className="
       w-full
       h-32
       object-cover
       rounded
       "

      />

      <p>
       {asset.name}
      </p>

     </div>

    )
   )}

  </div>

 </div>

 );

}