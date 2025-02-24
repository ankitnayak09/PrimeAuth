import { hashPassword, prisma } from "./../database/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import ErrorHandler from "../utils/ErrorHandler.js";

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

export { signup };
