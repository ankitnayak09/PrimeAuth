import express from "express";

const app = express();

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))

// Routes Import
import  healthRouter from "./routes/health.route.js";

// Routes Declaration
app.use("/v1/health",healthRouter);

// Error Handler
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Something went wrong");
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
})

export {app}