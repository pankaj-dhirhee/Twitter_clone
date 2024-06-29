import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
	try {
		const { token } = req.cookies;
		console.log(token);

		if (!token) {
			return res.status(401).json({
				message: "User not authenticated",
				success: false,
			});
		}

		const decode = await jwt.verify(token, process.env.TOKEN_SECRET);
		console.log(decode);
		req.body.id = decode.tokenData.userId;
		next();
	} catch (error) {
		console.log("Error accured in auth middleware ", error);
	}
};

export default isAuthenticated;
