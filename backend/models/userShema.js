import mongoose from "mongoose";

const userSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		username: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		followers: {
			type: Array,
			default: [],
		},
		followings: {
			type: Array,
			default: [],
		},
		bookmarks: {
			type: Array,
			default: [],
		},
	},
	{ timestamps: true }
);

export const userModel = mongoose.model("user", userSchema);
