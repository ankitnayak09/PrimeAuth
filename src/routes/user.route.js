import {signupUser} from "./../controllers/user.controller.js"

import { Router } from "express";
const router = Router();

// TODO: Get User Details
// TODO: Register User
router.route("/signup").post(signupUser)
// TODO: Login User
// TODO: Change Password
// TODO: Forgot Password

export default router;