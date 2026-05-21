import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const isUserAlreadyExists = await userModel.findOne({ 
      $or: [ {email }, {username} ] 
    });

    if (isUserAlreadyExists) {
      return res.status(400).json({ 
        message: "User with email or username already exists",
        success: false,
        err: "User already exists"
      });
    }

    // Create new user
    const user = await userModel.create({ username, email, password });
  
    res.status(201).json({ 
      message: "User registered successfully" 
    });


  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ 
      message: "Internal server error" 
    });
  }
};
