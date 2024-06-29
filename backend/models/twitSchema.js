import mongoose from "mongoose";

const twitSchema = mongoose.Schema(
	{
		description: {
			type: String,
			required: true,
		},
		like: {
			type: Array,
			default: [],
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "user",
		},
		userDetails: {
			type: Array,
			default: [],
		},
	},
	{ timestamps: true }
);

export const twitModel = mongoose.model("twits", twitSchema);
