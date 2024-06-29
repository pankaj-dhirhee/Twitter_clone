import express from "express";
import {
	Bookmark,
	Login,
	Logout,
	Register,
	GetMyProfile,
	GetOtherUsers,
	Follow,
	Unfollow,
} from "../controllers/userController.js";
import isAuthenticated from "../middlewares/authMiddleware.js";
const router = express.Router();

router.route("/register").post(Register);
router.route("/login").post(Login);
router.route("/logout").get(Logout);
router.route("/bookmark/:id").put(isAuthenticated, Bookmark);
router.route("/profile/:id").get(isAuthenticated, GetMyProfile);
router.route("/other-users/:id").get(isAuthenticated, GetOtherUsers);
router.route("/follow/:id").post(isAuthenticated, Follow);
router.route("/unfollow/:id").post(isAuthenticated, Unfollow);

export const userRoutes = router;
