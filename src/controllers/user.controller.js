import {
	hashPassword,
	prisma,
	isPasswordCorrect,
	generateAccessToken,
	generateRefreshToken,
} from "./../database/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import jwt from "jsonwebtoken";

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

	const isPasswordValid = await isPasswordCorrect(password, user.password);

	if (!isPasswordValid) throw new ErrorHandler(401, "Invalid Credentials");

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

const verify = asyncHandler(async (req, res) => {
	const token = req.cookies.accessToken;

	if (!token) {
		throw new ErrorHandler(401, "Access token is missing");
	}

	try {
		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		const user = await prisma.user.findUnique({
			where: { id: decoded.id },
			select: {
				id: true,
				username: true,
				email: true,
				fullName: true,
			},
		});

		if (!user) {
			throw new ErrorHandler(404, "User not found");
		}

		return res.status(200).json({
			success: true,
			user,
		});
	} catch (error) {
		throw new ErrorHandler(401, "Invalid access token");
	}
});
export { signup, login, verify };
