class ErrorHandler extends Error {
	constructor(
		statusCode,
		message = "Something Went Wrong",
		errors = [],
		stack = ""
	) {
		super(message);
		this.statusCode = statusCode;
		// TODO: why next line?
		this.data = null;
		this.message = message;
		this.success = false;
		this.errors = errors;

		if (stack) {
			this.stack = stack;
		} else {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}

export default ErrorHandler;
