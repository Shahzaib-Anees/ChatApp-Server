import { schemaForUser } from "../models/user.model.js";
import bcrypt from "bcrypt";

const setSecretCodeForLockedChats = async (req, res) => {
  const { secretCode } = req.body;
  const { email } = req.user;
  if (!secretCode) {
    return res
      .status(400)
      .json({ status: 400, message: "Secret code is required" });
  }

  try {
    const existingUser = await schemaForUser.findOne({ email: email });
    if (!existingUser) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }
    const encryptedSecretCode = await bcrypt.hash(secretCode, 10);
    existingUser.secretLockCode = encryptedSecretCode;
    await existingUser.save();
    return res
      .status(200)
      .json({ status: 200, message: "Secret code set successfully" });
  } catch (error) {
    console.error("Error setting secret code:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

const verifySecretCodeForLockedChats = async (req, res) => {
  const { secretCode } = req.body;
  console.log("request body:", req.body);
  const { email } = req.user;
  if (!secretCode) {
    return res
      .status(400)
      .json({ status: 400, message: "Secret code is required" });
  }
  try {
    const existingUser = await schemaForUser.findOne({ email: email });
    if (!existingUser) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }
    const isMatch = await bcrypt.compare(
      secretCode,
      existingUser.secretLockCode
    );
    if (!isMatch) {
      return res
        .status(400)
        .json({ status: 400, message: "Invalid secret code" });
    }
    return res
      .status(200)
      .json({ status: 200, message: "Secret code verified successfully" });
  } catch (error) {
    console.error("Error verifying secret code:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

export { setSecretCodeForLockedChats, verifySecretCodeForLockedChats };
