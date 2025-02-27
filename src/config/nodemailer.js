import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	host: "sandbox.smtp.mailtrap.io",
	port: 465,
	auth: {
		user: "b714945ca633b3",
		pass: "23914eddd5d9f7",
	},
});

export default transporter;
