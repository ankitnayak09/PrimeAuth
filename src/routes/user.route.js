import {
	login,
	signup,
	logout,
	verifyUser,
	forgotPassword,
} from "./../controllers/user.controller.js";
import verify from "../middlewares/verify.js";

import { Router } from "express";
const router = Router();

router.route("/verify").post(verify, verifyUser);

router.route("/signup").post(signup);

router.route("/login").post(login);

// TODO: Change Password
router.route("/change-password", () => {});

router.route("/forgot-password").post(verify, forgotPassword);

router.route("/logout").post(verify, logout);

export default router;
