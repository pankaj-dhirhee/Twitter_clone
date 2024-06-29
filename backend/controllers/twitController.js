import { twitModel } from "../models/twitSchema.js";
import { userModel } from "../models/userShema.js";

export const CreateTwit = async (req, res) => {
	try {
		const { description, id } = req.body;
		if (!description || !id) {
			res.status(401).json({
				message: "All fields are required",
				success: false,
			});
		}

		const user = await userModel.findById(id).select("-password");

		await twitModel.create({
			description,
			userId: id,
			userDetails: user,
		});

		res.status(200).json({
			message: "Twit created successfully",
			success: true,
		});
	} catch (error) {
		console.log("Error accured while creating twit: ", error);
	}
};

export const DeleteTwit = async (req, res) => {
	try {
		const { id } = req.params;

		await twitModel.findByIdAndDelete(id);
		res.status(200).json({
			message: "Twit deleated successfully",
			success: true,
		});
	} catch (error) {
		console.log("Error accured while deleating twit", error);
	}
};

export const LikeDislike = async (req, res) => {
	try {
		const loggedInUserId = req.body.id;
		const twitId = req.params.id;
		console.log(req.body);
		const twit = await twitModel.findById(twitId);

		if (twit.like.includes(loggedInUserId)) {
			// Dislike
			await twitModel.findByIdAndUpdate(twitId, {
				$pull: {
					like: loggedInUserId,
				},
			});
			return res.status(200).json({
				message: "User disliked your twit",
			});
		} else {
			// Like
			await twitModel.findByIdAndUpdate(twitId, {
				$push: { like: loggedInUserId },
			});
			return res.status(200).json({
				message: "User liked your twit",
				success: true,
			});
		}
	} catch (error) {
		console.log("Error accured while like or disliking the twit", error);
	}
};

export const GetAlTwits = async (req, res) => {
	try {
		// Logged in user + followings user twits
		const id = req.params.id;
		const loggedInUser = await userModel.findById(id);
		const loggedInUserTwits = await twitModel.find({
			userId: id,
		});
		const followingUserTwits = await Promise.all(
			loggedInUser.followings.map((otherUsersId) => {
				return twitModel.find({ userId: otherUsersId });
			})
		);
		return res.status(200).json({
			twits: loggedInUserTwits.concat(...followingUserTwits),
		});
	} catch (error) {
		console.log("Error accured while getting all twits", error);
	}
};

export const GetFollowingTwits = async (req, res) => {
	try {
		const id = req.params.id;
		const loggedInUser = await userModel.findById(id);
		const followingUserTwits = await Promise.all(
			loggedInUser.followings.map((otherUsersId) => {
				return twitModel.find({ userId: otherUsersId });
			})
		);
		return res.status(200).json({
			twits: [].concat(...followingUserTwits),
		});
	} catch (error) {
		console.log("Error accured while getting following twits", error);
	}
};
