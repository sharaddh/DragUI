import Component
from "../models/Component.js";

// A stale lock (crashed editor session, closed tab) may be taken over
// after this many milliseconds.
const LOCK_TTL_MS =
  5 * 60 * 1000;

const isLockExpired =
 (lockedAt) => {

  if (!lockedAt) return true;

  return (
   Date.now() -
   new Date(lockedAt).getTime()
  ) > LOCK_TTL_MS;

 };

export const lockComponent =
async (req,res)=>{

 try{

  const component =
   await Component.findById(
    req.params.id
   );

  if(!component){

   return res.status(404)
   .json({
    success:false,
    message:"Component not found"
   });

  }

  if(
   component.lockedBy &&
   component.lockedBy.toString()
   !== req.adminId &&
   !isLockExpired(component.lockedAt)
  ){

   return res.status(400)
   .json({
    success:false,
    message:
     "Already locked"
   });

  }

  component.lockedBy =
   req.adminId;

  component.lockedAt =
   new Date();

  await component.save();

  res.json({
   success:true,
   component
  });

 }catch(error){

  res.status(500).json({
   success:false,
   message:error.message
  });

 }

};

export const unlockComponent =
async(req,res)=>{

 try{

  const component =
   await Component.findById(
    req.params.id
   );

  if(!component){

   return res.status(404)
   .json({
    success:false,
    message:"Component not found"
   });

  }

  // Only the lock holder may release the lock; anyone may clear an expired
  // lock. This prevents one admin from stealing another admin's edit lock.
  if (
   component.lockedBy &&
   component.lockedBy.toString()
   !== req.adminId &&
   !isLockExpired(component.lockedAt)
  ) {

   return res.status(403)
   .json({
    success:false,
    message:
     "Lock held by another admin"
   });

  }

  component.lockedBy =
   null;

  component.lockedAt =
   null;

  await component.save();

  res.json({
   success:true,
   component
  });

 }catch(error){

  res.status(500).json({
   success:false,
   message:error.message
  });

 }

};