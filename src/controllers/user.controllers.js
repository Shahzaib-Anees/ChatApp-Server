import dotenv from "dotenv";
dotenv.config();
import {
  createAccessToken,
  createRefreshToken,
  generateCode,
  sentEmail,
} from "../methods/Methods.js";
import { schemaForUser } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { transporter } from "../configs/nodemailer.config.js";
import { schemaForVerify } from "../models/verify.model.js";
import { emailTemplates } from "../configs/email.template.js";

// get Users
const getUsers = async (req, res) => {
  const users = await schemaForUser.find();
  return res.status(200).json({
    data: users,
  });
};

// Register User
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username) {
    return res.status(400).json({
      message: "Name is required",
    });
  } else {
    const existingUser = await schemaForUser.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        message: "User name already taken",
      });
    }
  }

  if (!email) {
    return res.status(400).json({
      message: "Email is required",
    });
  } else {
    const existingUser = await schemaForUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already taken",
      });
    }
  }

  if (!password)
    return res.status(400).json({
      message: "Password is required",
    });

  const newUser = await schemaForUser.create({
    username,
    email,
    password,
  });

  const verificationCode = generateCode();
  const emailContent = emailTemplates.registerVerificationEmail(
    newUser.username,
    verificationCode
  );
  const existinfVerificationCode = await schemaForVerify.findOne({
    userId: newUser._id,
  });
  if (existinfVerificationCode) {
    return res.status(400).json({
      message: "Verification code already sent",
    });
  }
  await sentEmail(newUser.email, "Verify Your Email for ChatBox", emailContent);
  await schemaForVerify.create({
    userId: newUser._id,
    verificationCode,
  });

  return res.status(201).json({
    message: "Please check your email for verification",
    user: newUser,
  });
};

// Verify User Mail
const logInUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email)
    return res.status(400).json({
      message: "Email is required",
    });
  if (!password)
    return res.status(400).json({
      message: "Password is required",
    });

  const user = await schemaForUser.findOne({ email: email });
  if (!user)
    return res.status(404).json({
      message: "No account found with this email",
    });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid)
    return res.status(401).json({
      message: "Incorrect password",
    });

  const code = generateCode();
  const emailContent = emailTemplates.loginVerificationEmail(
    user.username,
    code
  );
  const existinfVerificationCode = await schemaForVerify.findOne({
    userId: user._id,
  });
  if (existinfVerificationCode) {
    return res.status(400).json({
      message: "Verification code already sent",
    });
  }
  await sentEmail(user.email, "Verify login attempt for ChatBox", emailContent);
  await schemaForVerify.create({
    userId: user._id,
    verificationCode: code,
  });
  return res.status(200).json({
    message: "Please verify yourself to complete login",
    data: user,
  });
};

// find Account by email
const findUserAccount = async (req, res) => {
  const { email } = req.body;
  if (!email)
    return res.status(400).json({
      message: "Email is required",
    });

  const user = await schemaForUser.findOne({ email: email });
  if (!user)
    return res.status(404).json({
      message: "No account found with this email",
    });

  const verificationCode = generateCode();
  const emailContent = emailTemplates.accountRecoveryEmail(
    user.username,
    verificationCode
  );

  const existinfVerificationCode = await schemaForVerify.findOne({
    userId: user._id,
  });
  if (existinfVerificationCode) {
    return res.status(400).json({
      message: "Verification code already sent",
    });
  }

  await sentEmail(user.email, "Verify Your Email for ChatBox", emailContent);
  await schemaForVerify.create({
    userId: user._id,
    verificationCode,
  });
  return res.status(200).json({
    message: "Verify to recover your account",
    data: user,
  });
};

// refreh access token
const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res.status(400).json({
      message: "Refresh token is required",
    });

  const isValidRefrehToken = jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_TOKEN_SECRET
  );
  if (!isValidRefrehToken)
    return res.status(401).json({
      message: "Invalid refresh token",
    });
  const user = await schemaForUser.findOne({ email: isValidRefrehToken.email });
  if (!user)
    return res.status(404).json({
      message: "No account found",
    });

  const accessToken = createAccessToken(user);
  return res.status(200).json({
    message: "Access token refreshed",
    accessToken,
  });
};

const sentVerificationCode = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });
  const user = await schemaForUser.findOne({ email: email });
  if (!user) return res.status(404).json({ message: "User not found" });
  const verificationCode = generateCode();
  const emailContent = emailTemplates.otpRequestEmail(
    user.username,
    verificationCode
  );
  const existinfVerificationCode = await schemaForVerify.findOne({
    userId: user._id,
  });
  if (existinfVerificationCode) {
    return res.status(400).json({
      message: "Verification code already sent",
    });
  }
  await sentEmail(user.email, "Verify Your Email for ChatBox", emailContent);
  await schemaForVerify.create({
    userId: user._id,
    verificationCode,
  });
  return res.status(200).json({
    message: "Verification code sent",
  });
};

// Verify Code
const verifyCode = async (req, res) => {
  const { email, code, type } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });
  if (!code) return res.status(400).json({ message: "Code is required" });
  if (!type) return res.status(400).json({ message: "Type is required" });
  const user = await schemaForUser.findOne({ email: email });
  if (!user) return res.status(404).json({ message: "User not found" });
  const verificationCode = await schemaForVerify.findOne({
    userId: user._id,
  });

  if (!verificationCode)
    return res.status(404).json({ message: "Code not found" });

  if (verificationCode.verificationCode !== code)
    return res.status(400).json({ message: "Invalid code" });

  await schemaForVerify.findOneAndDelete({ _id: verificationCode._id });
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);
  if (type === "email_verification") {
    await schemaForUser.findOneAndUpdate(
      { _id: user._id },
      { isVerified: true }
    );
    return res.status(200).json({
      message: "Your Account has been verified",
      accessToken,
      refreshToken,
    });
  } else {
    return res
      .status(200)
      .json({ message: "Code verified", accessToken, refreshToken });
  }
};

// reset password
const resetPassword = async (req, res) => {
  const email = req.user?.email;
  const { password } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });
  if (!password)
    return res.status(400).json({ message: "Password is required" });

  const existingUser = await schemaForUser.findOne({ email: email });
  if (!existingUser) return res.status(404).json({ message: "User not found" });
  const isPrevPassword = await bcrypt.compare(password, existingUser.password);
  if (isPrevPassword)
    return res.status(400).json({
      message: "New Password cannot be the same as the previous password",
    });

  const hashedPassword = await bcrypt.hash(password, 10);
  const updatedData = await schemaForUser.findOneAndUpdate(
    { _id: existingUser._id },
    { password: hashedPassword },
    { new: true }
  );

  return res.status(200).json({
    message: "Password updated successfully",
    data: updatedData,
  });
};

export {
  getUsers,
  registerUser,
  logInUser,
  findUserAccount,
  refreshAccessToken,
  verifyCode,
  resetPassword,
  sentVerificationCode,
};
