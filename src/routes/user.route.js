import {
	login,
	signup,
	logout,
	verifyUser,
	changePassword,
	forgotPassword,
	resetPassword,
} from "./../controllers/user.controller.js";
import verify from "../middlewares/verify.js";

import { Router } from "express";
const router = Router();

router.route("/verify").post(verify, verifyUser);

router.route("/signup").post(signup);

router.route("/login").post(login);

router.route("/change-password").post(verify, changePassword);

router.route("/forgot-password").post(forgotPassword);

router.route("/reset-password/:token").post(resetPassword);

router.route("/logout").post(verify, logout);

export default router;
