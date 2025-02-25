import {
	login,
	signup,
	logout,
	verifyUser,
} from "./../controllers/user.controller.js";
import verify from "../middlewares/verify.js";

import { Router } from "express";
const router = Router();

router.route("/verify").post(verify, verifyUser);

router.route("/signup").post(signup);

router.route("/login").post(login);

// TODO: Change Password
router.route("/change-password", () => {});

// TODO: Forgot Password
router.route("/forgot-password", () => {});

// TODO: Logout
router.route("/logout").post(verify, logout);

export default router;
