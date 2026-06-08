export default function PreviewPanel({
 code
}) {

 return (

  <iframe

   title="preview"

   className="
   w-full
   h-full
   bg-white
   "

   srcDoc={`
   <!DOCTYPE html>

   <html>

   <body>

   <div id="root"></div>

   <script>
   ${code}
   </script>

   </body>

   </html>
   `}
  />

 );

}