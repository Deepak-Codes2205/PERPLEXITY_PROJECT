import { Router } from "express";
import {registerUser} from "../controllers/auth.controller.js";
import { registerValidation } from "../validators/auth.validator.js";

const authRouter = Router();


/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
authRouter.post("/register", registerValidation, registerUser);
  

//authRouter.post("/login", loginUser);

export default authRouter;