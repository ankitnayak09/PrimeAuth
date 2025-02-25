import { login, signup, verify } from "./../controllers/user.controller.js";

import { Router } from "express";
const router = Router();

router.route("/verify").get(verify);

router.route("/signup").post(signup);

router.route("/login").post(login);

// TODO: Change Password
router.route("/change-password", () => {});

// TODO: Forgot Password
router.route("/forgot-password", () => {});

// TODO: Logout

export default router;
