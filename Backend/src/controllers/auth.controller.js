import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";

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
  
    // Send welcome email
    await sendEmail({
      to: email,
      subject: "Welcome to Our App",
      html: `
            <p>Hi ${username},</p>
            <p>Thank you for registering with our app! We are excited to have you on board.</p>
            <p>Best regards,<br>The Team</p>
          `
    });


    res.status(201).json({
      message: "User registered successfully",
      success: true,  
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });


  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ 
      message: "Internal server error" 
    });
  }
};
