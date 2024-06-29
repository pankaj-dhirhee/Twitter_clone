import { userModel } from "../models/userShema.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

export const Register = async (req, res) => {
	try {
		const { name, username, email, password } = req.body;

		// Checking if all the fields are given or not
		if (!name || !username || !email || !password) {
			return res.status(401).json({
				message: "All fields are required",
				success: false,
			});
		}

		const user = await userModel.findOne({
			email: email,
		});

		// Checking if account already axists
		if (user) {
			res.status(401).json({
				message: "User already axist",
				success: false,
			});
		}

		const hashedPassword = await bcryptjs.hash(password, 16);

		await userModel.create({
			name,
			username,
			email,
			password: hashedPassword,
		});

		res.status(200).json({
			message: "Account created successfully",
			success: true,
		});
	} catch (error) {
		console.log(`[ Error accured while registering account: ${error} ]`);
	}
};

export const Login = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Checking if all the fields are given or not
		if (!email || !password) {
			return res.status(401).json({
				message: "All fields are required",
				success: false,
			});
		}

		const user = await userModel.findOne({
			email: email,
		});

		// Checking if account already axists
		if (!user) {
			res.status(401).json({
				message: "User does axist",
				success: false,
			});
		}

		const isMatch = await bcryptjs.compare(password, user.password);

		if (!isMatch) {
			return res.status(200).json({
				message: "Incorrect email or password",
				success: false,
			});
		}

		const tokenData = {
			userId: user._id,
		};
		const token = jwt.sign({ tokenData }, process.env.TOKEN_SECRET, {
			expiresIn: "1d",
		});

		res.status(201)
			.cookie("token", token, { expiresIn: "1d", httpOnly: true })
			.json({
				message: `Welcome back ${user.name}`,
				user,
				success: true,
			});
	} catch (error) {
		console.log(`[ Error accured while login to account:`, error);
	}
};

export const Logout = (req, res) => {
	return res.cookie("token", "", { expiresIn: new Date(Date.now()) }).json({
		message: "User logged out successfully",
		success: true,
	});
};

export const Bookmark = async (req, res) => {
	try {
		const loggedInUserId = req.body.id;
		const twitId = req.params.id;
		const user = await userModel.findById(loggedInUserId);
		if (user.bookmarks.includes(twitId)) {
			// Remove from bookmark
			await userModel.findByIdAndUpdate(loggedInUserId, {
				$pull: { bookmarks: twitId },
			});
			return res.status(200).json({
				message: "Removed from bookmark",
			});
		} else {
			// Save to Bookmark
			await userModel.findByIdAndUpdate(loggedInUserId, {
				$push: { bookmarks: twitId },
			});
			return res.status(200).json({
				message: "Saved bookmark",
			});
		}
	} catch (error) {
		console.log("Error accured while bookmarking the twit", error);
	}
};

export const GetMyProfile = async (req, res) => {
	try {
		const id = req.params.id;
		const user = await userModel.findById(id).select("-password");
		return res.status(200).json({
			user,
		});
	} catch (error) {
		console.log("Error accured while getting profile data", error);
	}
};

export const GetOtherUsers = async (req, res) => {
	const { id } = req.params;
	const otherUsers = await userModel
		.find({
			_id: { $ne: id },
		})
		.select("-password");
	if (!otherUsers) {
		return res.status(401).json({
			message: "Currently do not have any users",
		});
	}
	return res.status(200).json({
		otherUsers,
	});
};

export const Follow = async (req, res) => {
	try {
		const loggedInUserId = req.body.id;
		const userId = req.params.id;
		const loggedInUser = await userModel.findById(loggedInUserId);
		console.log("logges ", loggedInUser);
		const user = await userModel.findById(userId);

		if (!user.followers.includes(loggedInUserId)) {
			await user.updateOne({ $push: { followers: loggedInUserId } });
			await loggedInUser.updateOne({ $push: { followings: userId } });
		} else {
			return res.status(400).json({
				message: `user already followed to ${user.name}`,
			});
		}

		res.status(200).json({
			message: `${loggedInUser.name} just followed to: ${user.name}`,
		});
	} catch (error) {
		console.log("Error accured while following a user", error);
	}
};

export const Unfollow = async (req, res) => {
	try {
		const loggedInUserId = req.body.id;
		const userId = req.params.id;
		const loggedInUser = await userModel.findById(loggedInUserId);
		console.log("logges ", loggedInUser);
		const user = await userModel.findById(userId);

		if (loggedInUser.followings.includes(userId)) {
			await user.updateOne({ $pull: { followers: loggedInUserId } });
			await loggedInUser.updateOne({ $pull: { followings: userId } });
		} else {
			return res.status(400).json({
				message: `user has not followed yet`,
			});
		}

		res.status(200).json({
			message: `${loggedInUser.name} unfollowed to: ${user.name}`,
		});
	} catch (error) {
		console.log("Error accured while unfollowing a user", error);
	}
};
