import express from "express";
import {
  login,
  logout,
  signup,
  getMe,
  refreshAccessToken,
} from "../controllers/auth.controller.js";
import protectRoute from "../middlewares/protectedRoute.js";

const router = express.Router();

router.get("/me", protectRoute, getMe);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/refresh-token", refreshAccessToken);

export default router;
