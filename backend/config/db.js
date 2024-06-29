import mongoose from "mongoose";

const datbaseConnection = () => {
	mongoose
		.connect(process.env.DB_URL)
		.then(() => {
			console.log("Connected to mongodb...");
		})
		.catch((error) => {
			console.log(`Error accured while connecting to db: ${error}`);
		});
};

export default datbaseConnection;
