import { prisma } from "./../database/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import ErrorHandler from "../utils/ErrorHandler.js";

const signup = asyncHandler(async (req, res) => {
	// * Fetch Fields from req body: email,fullName,username
	// * Check if email or already exist, if yes then return res
	// * create user
	// * remove password field and return
	const { email, fullName, username,password } = req.body;
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
	// Hash the Password before saving into db
	const newUser = await prisma.user.create({
		data: {
			email,
			fullName,
			username,
			password
		},
	});
	return res.status(201).json({
		success: true,
		newUser,
	});
});

export { signup };
