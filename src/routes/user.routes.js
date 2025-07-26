import express from "express";
import {
  findUserAccount,
  getUserDetails,
  getUsers,
  logInUser,
  refreshAccessToken,
  registerUser,
  resetPassword,
  sentVerificationCode,
  setSecretCodeForLockedChats,
  verifyCode,
  verifySecretCodeForLockedChats,
} from "../controllers/user.controllers.js";
import { authenticate } from "../middlewares/authentication.middleware.js";

const router = express.Router();

router.get("/get", getUsers);
router.post("/register", registerUser);
router.post("/login", logInUser);
router.post("/refreshToken", refreshAccessToken);
router.post("/find", findUserAccount);
router.post("/verifyCode", verifyCode);
router.post("/requestCode", sentVerificationCode);
router.post("/resetPassword", authenticate, resetPassword);
router.get("/userDetails", authenticate, getUserDetails);
router.post("/setSecretCode", authenticate, setSecretCodeForLockedChats);
router.post("/verifySecretCode", authenticate, verifySecretCodeForLockedChats);
export default router;
