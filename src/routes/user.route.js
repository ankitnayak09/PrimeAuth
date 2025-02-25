import { login, signup, verify } from "./../controllers/user.controller.js";

import { Router } from "express";
const router = Router();

// TODO: Get User Details
router.route("/verify").get(verify);

// TODO: Register User
router.route("/signup").post(signup);

// TODO: Login User
router.route("/login").post(login);

// TODO: Change Password
router.route("/change-password", () => {});

// TODO: Forgot Password
router.route("/forgot-password", () => {});

export default router;
