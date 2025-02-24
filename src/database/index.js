import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const generateAccessToken = (user) => {
	const { id, email, username, fullName } = user;
	return jwt.sign(
		{
			id,
			email,
			username,
			fullName,
		},
		process.env.ACCESS_TOKEN_SECRET,
		{
			expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
		}
	);
};

const generateRefreshToken = async (user) => {
	const { username } = user;
	return jwt.sign({ username }, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
	});
};

const hashPassword = async (password) => {
	const hashedPassword = await bcrypt.hash(password, 10);
	return hashedPassword;
};
export { prisma, generateAccessToken, generateRefreshToken, hashPassword };
