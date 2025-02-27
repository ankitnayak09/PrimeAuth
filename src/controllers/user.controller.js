import {
	hashPassword,
	prisma,
	comparePassword,
	generateAccessToken,
	generateRefreshToken,
} from "./../database/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import checkPasswordValidity from "../utils/checkPasswordValidity.js";
import { sendEmail } from "../utils/email.js";
import crypto from "crypto";

const signup = asyncHandler(async (req, res) => {
	const { email, fullName, username, password } = req.body;
	if (!(email && fullName && username)) {
		console.log(1);
		throw new ErrorHandler(
			400,
			"Please Provide Email,Fullname and username"
		);
	}
	const user = await prisma.user.findFirst({
		where: {
			email,
		},
	});

	if (user) throw new ErrorHandler(400, "User already exists.");
	const usernameExist = await prisma.user.findFirst({
		where: {
			username,
		},
	});
	if (usernameExist) throw new ErrorHandler(400, "Username Already Exists");

	const isPasswordValid = checkPasswordValidity(password);
	if (!isPasswordValid.isValid)
		throw new ErrorHandler(400, isPasswordValid.error);

	const hashedPassword = await hashPassword(password);

	const newUser = await prisma.user.create({
		data: {
			email,
			fullName,
			username,
			password: hashedPassword,
		},
		select: {
			email: true,
			fullName: true,
			username: true,
			id: true,
		},
	});
	return res.status(201).json({
		success: true,
		newUser,
	});
});

const login = asyncHandler(async (req, res) => {
	// if password match, generate accesstoken and refreshtoken
	const { email, password } = req.body;

	if (!(email && password))
		throw new ErrorHandler(400, "Email and Password Required.");

	const user = await prisma.user.findUnique({
		where: { email },
	});

	if (!user) throw new ErrorHandler(400, "User Doesn't exist");

	const isPasswordValid = await comparePassword(password, user.password);

	if (!isPasswordValid) throw new ErrorHandler(401, "Invalid Password");

	const accessToken = generateAccessToken(user);
	const refreshToken = generateRefreshToken(user);

	const loggedInUser = await prisma.user.update({
		where: {
			email,
		},
		data: {
			refreshToken,
		},
		select: {
			id: true,
			username: true,
			email: true,
		},
	});

	const options = {
		httpOnly: true,
		secure: true,
	};
	return res
		.status(200)
		.cookie("accessToken", accessToken, options)
		.cookie("refreshToken", refreshToken, options)
		.json({
			success: true,
			user: loggedInUser,
			accessToken,
			refreshToken,
		});
});

const verifyUser = asyncHandler((req, res) => {
	return res.status(200).json({
		success: true,
		user: req.user,
	});
});

const logout = asyncHandler(async (req, res) => {
	// Remove refresh token from db
	// return user null
	await prisma.user.update({
		where: {
			id: req.user.id,
		},
		data: {
			refreshToken: null,
		},
	});
	const options = {
		httpOnly: true,
		secure: true,
	};
	return res
		.status(200)
		.clearCookie("accessToken", options)
		.clearCookie("refreshToken", options)
		.json({
			success: true,
			message: "Logged out successfully",
		});
});

const changePassword = asyncHandler(async (req, res) => {
	const { oldPassword, newPassword } = req.body;

	if (!(oldPassword && newPassword)) {
		throw new ErrorHandler(
			400,
			"Old Password, and New Password are required."
		);
	}

	const user = await prisma.user.findUnique({
		where: { id: req.user.id },
	});

	if (!user) throw new ErrorHandler(400, "User doesn't exist.");
	console.log(user.password);

	const isPasswordCorrect = await comparePassword(oldPassword, user.password);
	if (!isPasswordCorrect) throw new ErrorHandler(400, "Invalid Old Password");

	const isPasswordValid = checkPasswordValidity(newPassword);
	if (!isPasswordValid.isValid)
		throw new ErrorHandler(400, isPasswordValid.error);

	const hashedNewPassword = await hashPassword(newPassword);

	await prisma.user.update({
		where: { id: req.user.id },
		data: { password: hashedNewPassword },
	});

	return res.status(200).json({
		success: true,
		message: "Password updated successfully.",
	});
});

const forgotPassword = asyncHandler(async (req, res) => {
	const { email } = req.body;

	// Generate a reset token
	const resetToken = crypto.randomBytes(20).toString("hex");

	// Set token and expiration on user
	const resetPasswordExpires = new Date(Date.now() + 900000); // 15 minutes from now
	await prisma.user.update({
		where: { email },
		data: {
			resetPasswordToken: resetToken,
			resetPasswordExpires,
		},
	});

	// Send email
	const text = `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
    	Please click on the following link, or paste this into your browser to complete the process:\n\n
   		http://${req.headers.host}/reset-password/${resetToken}\n\n
    	If you did not request this, please ignore this email and your password will remain unchanged.\n`;

	await sendEmail(email, "Password Reset", text);

	res.status(200).json({
		success: true,
		message: "Password reset token sent to email",
	});
});

const resetPassword = asyncHandler(async (req, res) => {
	const { token } = req.params;
	const { newPassword } = req.body;

	if (!newPassword) throw new ErrorHandler(400, "New Password is required");

	const user = await prisma.user.findFirst({
		where: {
			resetPasswordToken: token,
			resetPasswordExpires: {
				gt: new Date(), // Check for token expiry
			},
		},
	});

	if (!user)
		throw new ErrorHandler(
			400,
			"Password reset token is invalid or has expired."
		);

	const hashedPassword = await hashPassword(newPassword);

	await prisma.user.update({
		where: { id: user.id },
		data: {
			password: hashedPassword,
			resetPasswordToken: null,
			resetPasswordExpires: null,
		},
	});

	res.status(200).json({
		success: true,
		message: "Password has been reset successfully",
	});
});

export {
	signup,
	login,
	logout,
	verifyUser,
	changePassword,
	forgotPassword,
	resetPassword,
};
