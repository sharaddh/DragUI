import {
 useEffect,
 useState
}
from "react";

import PresenceBar
from "../components/PresenceBar";

import ActivityFeed
from "../components/ActivityFeed";

export default function Collaboration(){

 const [
  users,
  setUsers
 ] = useState([]);

 const [
  activities,
  setActivities
 ] = useState([]);

 useEffect(()=>{

  load();

 },[]);

 const load =
 async()=>{

  setUsers([
   {
    id:1,
    name:"Sharad"
   },
   {
    id:2,
    name:"Emma"
   }
  ]);

  setActivities([
   {
    _id:1,
    message:
     "Sharad edited Button.jsx"
   },

   {
    _id:2,
    message:
     "Emma commented on Navbar.jsx"
   }
  ]);

 };

 return(

 <div
 className="
 space-y-6
 "
 >

  <div>

   <h1
    className="
    text-3xl
    font-bold
    "
   >

    Collaboration

   </h1>

   <p>
    Realtime team activity
   </p>

  </div>

  <PresenceBar
   users={users}
  />

  <ActivityFeed
   activities={activities}
  />

 </div>

 );

}