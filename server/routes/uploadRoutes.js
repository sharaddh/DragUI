import express
from "express";

import multer
from "multer";

import cloudinary
from "../config/cloudinary.js";

const router =
 express.Router();

const upload =
 multer({
  storage:
   multer.memoryStorage()
 });

router.post(
 "/",
 upload.single("file"),

 async(
  req,
  res
 )=>{

 try{

  const result =
   await cloudinary.uploader.upload(
    req.file.path,
    {
     folder:
      "dropui"
    }
   );

  res.json({
   url:
    result.secure_url
  });

 }catch(error){

  res.status(500).json({
   message:
    error.message
  });

 }

 });

export default router;