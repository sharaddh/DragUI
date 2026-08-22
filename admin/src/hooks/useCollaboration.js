import {
 useEffect,
 useRef
}
from "react";

import socket
from "../socket";

export default function useCollaboration({

 componentId,

 code,

 setCode

}){

 const lastRemoteRef =
  useRef(null);

 const setCodeRef =
  useRef(setCode);

 const handleRemoteUpdateRef =
  useRef(null);

 if (!handleRemoteUpdateRef.current) {

  handleRemoteUpdateRef.current =
   data => {

    lastRemoteRef.current =
     data?.code;

    setCodeRef.current(
     data?.code
    );

   };

 }

 useEffect(()=>{

  setCodeRef.current =
   setCode;

 },[setCode]);

 useEffect(()=>{

  socket.emit(
   "editor:join",
   {
    componentId
   }
  );

  socket.on(
   "editor:update",

   handleRemoteUpdateRef.current
  );

  return()=>{

   socket.off(
    "editor:update",
    handleRemoteUpdateRef.current
   );

  };

 },[componentId]);

 useEffect(()=>{

  if (code === lastRemoteRef.current) {

   return;

  }

  socket.emit(
   "editor:update",
   {
    componentId,
    code
   }
  );

 },[componentId, code]);

}
