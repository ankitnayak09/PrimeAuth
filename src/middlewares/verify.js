import { prisma } from "../database/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import jwt from "jsonwebtoken";

const verify = asyncHandler(async (req, _, next) => {
	const token =
		req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
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
		req.user = user;
		next();
	} catch (error) {
		throw new ErrorHandler(401, "Invalid access token");
	}
});

export default verify;
