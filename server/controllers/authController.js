import jwt from "jsonwebtoken";

import User from "../models/User.js";

export const getProfile =
async (
  req,
  res
) => {

  try {

    const user =
      await User.findById(
        req.userId
      )
      .select("-password");

    res.json({
      success:true,
      user
    });

  } catch(error){

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};