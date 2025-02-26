const checkPasswordValidity = (password) => {
	if (password.length < 8)
		return {
			isValid: false,
			error: "Password must have Minimum length should be 8",
		};

	if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password))
		return {
			isValid: false,
			error: "Password must contain both letters and numbers",
		};

	if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
		return {
			isValid: false,
			error: "Password must contain at least one special character",
		};

	return {
		isValid: true,
	};
};

export default checkPasswordValidity;
