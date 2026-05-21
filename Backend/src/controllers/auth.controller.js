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

    const emailVerificationToken = jwt.sign({
      email: user.email,
    }, process.env.JWT_SECRET);
  
    // Send welcome email
    await sendEmail({
      to: email,
      subject: "Welcome to Our App",
      html: `
            <p>Hi ${username},</p>
            <p>Thank you for registering with our app! We are excited to have you on board.</p>
            <p>Please verify your email address by clicking the link below:</p>
            <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
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


//export async function verifyEmail(req, res) {
export const verifyEmail = async (req, res) => {
  
  const { token } = req.query;

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // if (!token) {
  //   return res.status(400).json({ 
  //     message: "Verification token is missing" 
  //   });
  // }

  const user = await userModel.findOne({ email: decoded.email });

  if (!user) {
    return res.status(400).json({ 
      message: "Invalid verification token",
      success: false,
      err: "User not found"
    });
  }

  user.verified = true;
  await user.save();

  const html = `
    <p>Hi ${user.username},</p>
    <p>Your email has been successfully verified! You can now log in to your account.</p>
    <p>Best regards,<br>The Team</p>
    <a href="http://localhost:3000/login">Login to Your Account</a>
  `;  

}