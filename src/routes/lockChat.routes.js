import express from "express";
import { authenticate } from "../middlewares/authentication.middleware.js";
import {
  setSecretCodeForLockedChats,
  verifySecretCodeForLockedChats,
} from "../controllers/lockChatsControllers.js";

const router = express.Router();
router.post("/setSecretCode", authenticate, setSecretCodeForLockedChats);
router.post("/verifySecretCode", authenticate, verifySecretCodeForLockedChats);

export default router;
