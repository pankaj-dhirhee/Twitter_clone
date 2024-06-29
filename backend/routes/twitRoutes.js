import express from "express";
import {
	CreateTwit,
	DeleteTwit,
	GetAlTwits,
	GetFollowingTwits,
	LikeDislike,
} from "../controllers/twitController.js";
import isAuthenticated from "../middlewares/authMiddleware.js";
const router = express.Router();

router.route("/create").post(isAuthenticated, CreateTwit);
router.route("/delete/:id").delete(isAuthenticated, DeleteTwit);
router.route("/like/:id").put(isAuthenticated, LikeDislike);
router.route("/get-all-twits/:id").get(isAuthenticated, GetAlTwits);
router
	.route("/following-user-twits/:id")
	.get(isAuthenticated, GetFollowingTwits);

export const twitRoutes = router;
