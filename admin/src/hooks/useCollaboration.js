import {
 useEffect
}
from "react";

import socket
from "../socket";

export default function useCollaboration({

 componentId,

 code,

 setCode

}){

 useEffect(()=>{

  socket.emit(
   "editor:join",
   {
    componentId
   }
  );

  socket.on(
   "editor:update",

   data=>{

    setCode(
     data.code
    );

   }
  );

  return()=>{

   socket.off(
    "editor:update"
   );

  };

 },[]);

 useEffect(()=>{

  socket.emit(
   "editor:update",
   {
    componentId,
    code
   }
  );

 },[code]);

}