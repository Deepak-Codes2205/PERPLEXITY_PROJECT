import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";
import cookieParser from "cookie-parser"; 


/**
 *@desc Register a new user
 *@route POST /api/auth/register
 *@access Public
 *@body { username, email, password }
 */
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
            <p>Thank you for registering at <strong>Perplexity</strong>. We are excited to have you on board.</p>
            <p>Please verify your email address by clicking the link below:</p>
            <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
            <p>Best regards,<br>The Perplexity Team</p>
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



/**
 * 
 * @desc Login user and return JWT token
 * @route POST /api/auth/login
 * @access Public
 * @body { email, password }  
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
        success: false,
        err: "User not found"
      });
    } 

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
        success: false,
        err: "Incorrect password"
      });
    } 

    if(!user.verified) {
      return res.status(403).json({
        message: "Email not verified. Please verify your email before logging in.",
        success: false,
        err: "Email not verified"
      });
    }

    // await sendEmail({
    //   to: email,
    //   subject: "Welcome to Our App",
    //   html: `
    //         <p>Hi ${username},</p>
    //         <p>Thank you for registering at <strong>Perplexity</strong>. We are excited to have you on board.</p>
    //         <p>Please verify your email address by clicking the link below:</p>
    //         <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
    //         <p>Best regards,<br>The Perplexity Team</p>
    //       `
    // });
    
    const token = jwt.sign({ 
      id: user._id,
      username: user.username,
    }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token)

    res.status(200).json({
      message: "Login successful",
      success: true, 
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  }
  catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({  
      message: "Internal server error"
    });
  }
}


/**
 * @desc Resend verification email
 * @route POST /api/auth/resend-verification
 * @access Public
 */
export const resendVerificationEmail = async (req, res) => {
  try {

    const { email } = req.body;

    // Check user exists
    const user = await userModel.findOne({ email });
    
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Check if already verified
    if (user.verified) {
      return res.status(400).json({
        message: "Email already verified",
        success: false,
      });
    }

    // Generate new token
    const emailVerificationToken = jwt.sign({
        email: user.email,
      },process.env.JWT_SECRET);

    // Send verification email again
    await sendEmail({
      to: user.email,
      subject: "Verify Your Email",
      html: `
        <p>Hi ${user.username},</p>

        <p>You requested a new email verification link.</p>

        <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">
          Verify Email
        </a>

        <p>This link will expire in 1 hour.</p>

        <p>Best regards,<br/>Perplexity Team</p>
      `,
    });

    return res.status(200).json({
      message: "Verification email sent successfully",
      success: true,
    });

  } catch (error) {

    console.error("Resend verification error:", error);

    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};



/**
 * @desc Get current logged in user details
 * @route GET /api/auth/get-me
 * @access Private  
 */

export const getMe = async (req, res) => {
  
  const userId = req.user.id;
  const user = await userModel.findById(userId).select("-password");

  if (!user) {
    return res.status(404).json({
      message: "User not found",
      success: false,
      err: "User not found"
    });
  }

  res.status(200).json({
    message: "User details fetched successfully",
    success: true,
    user
  });
   

}



/**
  * @desc Verify user's email address
  * @route GET /api/auth/verify-email
  * @access Public
  * @query { token }  
 */
//export async function verifyEmail(req, res) {

export const verifyEmail = async (req, res) => {
  
  const { token } = req.query;

    try{
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await userModel.findOne({ email: decoded.email });

      if (!user) {
        return res.status(400).json({ 
          message: "Invalid verification token",
          success: false,
          err: "User not found"
        });
      }

      if (user.verified) {
        const html = `
        <p>Hi ${user.username},</p>
        <p>Email is already verified!</p>
        <p>Your email has been already verified!</p>
        <a href="http://localhost:3000/api/auth/login">Login to Your Account</a>
      `;  
        return res.send(html);
      }


      user.verified = true;
      await user.save();

      const html = `
        <p>Hi ${user.username},</p>
        <p>Email verification successfully!</p>
        <p>Your email has been successfully verified! You can now log in to your account.</p>
        <a href="http://localhost:3000/api/auth/login">Login to Your Account</a>
      `;  

      return res.send(html);

    }catch (error) {
      return res.status(400).json({ 
        message: "Invalid or expired verification token", 
        success: false,
        err: error.message
    });
  }
}

