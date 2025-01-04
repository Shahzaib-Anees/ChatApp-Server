import express from "express";
import {
  findUserAccount,
  getUsers,
  logInUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/user.controllers.js";

const router = express.Router();

router.get("/get" , getUsers)
router.post("/register", registerUser);
router.post("/login", logInUser);
router.post("/refresh-token", refreshAccessToken);
router.post("/find", findUserAccount);

export default router;
