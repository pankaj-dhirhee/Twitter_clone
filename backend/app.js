import express from "express";
import dotenv from "dotenv";
import datbaseConnection from "./config/db.js";
import cookieParser from "cookie-parser";
import { userRoutes } from "./routes/userRoutes.js";
import { twitRoutes } from "./routes/twitRoutes.js";
import cors from "cors";

dotenv.config({
	path: "./config/.env",
});

datbaseConnection();
const app = express();

// Middlewares
app.use(
	express.urlencoded({
		extended: true,
	})
);
app.use(express.json());
app.use(cookieParser());
const corsOption = {
	origin: "https://twitter-clone-backend-1yb0.onrender.com/",
	credentials: true,
};
app.use(cors(corsOption));

//Api
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/twit", twitRoutes);

const port = process.env.PORT;
app.listen(port, () => {
	console.log(`Server is running at: http://loacalhost:${port}`);
});
