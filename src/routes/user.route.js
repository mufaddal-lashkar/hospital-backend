import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import authenticate from "../middlewares/authenticate.js";

const router = Router();

router.route("/login").post(loginUser)
router.route("/register").post(registerUser)
router.route("/logout").get(authenticate, logoutUser)

export default router