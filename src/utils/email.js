import transporter from "../config/nodemailer.js";
import asyncHandler from "./asyncHandler.js";

const sendEmail = async (to, subject, text) => {
	const mailOptions = {
		from: process.env.EMAIL_USER,
		to,
		subject,
		text,
	};

	await transporter.sendMail(mailOptions);
};

const sendOTP = asyncHandler(async (to, otp) => {
	const subject = "Your OTP Code";
	const text = `Your OTP code is ${otp}. It will expire in 10 miutes.`;
	await sendEmail(to, subject, text);
});

const sendVerificationToken = asyncHandler(async (to, token) => {
	const subject = "Email Verification";
	const text = `Please verify your email by clicking the following link: http://${process.env.HOST}/verify-email?token=${token}`;
	await sendEmail(to, subject, text);
});

export { sendOTP, sendVerificationToken, sendEmail };
