import express from "express";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes Import
import healthRouter from "./routes/health.route.js";
import userRouter from "./routes/user.route.js";

// Routes Declaration
app.use("/v1/health", healthRouter);
app.use("/v1", userRouter);

// Error Handler
app.use((err, req, res, next) => {
	console.log(err);
	return res.status(500).send("Something went wrong");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log("Server is running on port", PORT);
});

export { app };
