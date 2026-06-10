export default function ActivityFeed({
 activities
}){

 return(

 <div
 className="
 bg-white
 border
 rounded-xl
 p-5
 "
 >

  <h2
   className="
   font-semibold
   mb-4
   "
  >
   Activity Feed
  </h2>

  <div
   className="
   space-y-3
   "
  >

   {activities.map(
    activity=>(

     <div
      key={
       activity._id
      }

      className="
      border-b
      pb-2
      "
     >

      {
       activity.message
      }

     </div>

    )
   )}

  </div>

 </div>

 );

}