export default function FileExplorer({
 files,
 selected,
 setSelected
}) {

 return (

  <div
   className="
   w-64
   bg-zinc-950
   border-r
   border-zinc-800
   "
  >

   {files.map(
    file=>(
     <button

      key={file.name}

      onClick={()=>
      setSelected(
       file.name
      )}

      className={`
      block
      w-full
      text-left
      px-4
      py-3

      ${
      selected===
      file.name

      ? "bg-zinc-800"

      : ""
      }
      `}
     >

      {file.name}

     </button>
    )
   )}

  </div>

 );

}