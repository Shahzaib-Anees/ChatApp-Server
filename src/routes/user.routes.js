import express from "express";
import {
  findUserAccount,
  getUsers,
  logInUser,
  refreshAccessToken,
  registerUser,
  resetPassword,
  sentVerificationCode,
  verifyCode,
} from "../controllers/user.controllers.js";
import { authenticate } from "../middlewares/authentication.middleware.js";

const router = express.Router();

router.get("/get", getUsers);
router.post("/register", registerUser);
router.post("/login", logInUser);
router.post("/refresh-token", refreshAccessToken);
router.post("/find", findUserAccount);
router.post("/verifyCode", verifyCode);
router.post("requestCode", sentVerificationCode);
router.post("/resetPassword", authenticate, resetPassword);

export default router;
