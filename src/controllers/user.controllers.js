import dotenv from "dotenv";
dotenv.config();
import {
  createAccessToken,
  createRefreshToken,
  generateCode,
} from "../methods/Methods.js";
import { schemaForUser } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { transporter } from "../configs/nodemailer.config.js";
import { schemaForVerify } from "../models/verify.model.js";

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

  const accessToken = createAccessToken(newUser);
  const refreshToken = createRefreshToken(newUser);

  return res.status(201).json({
    message: "User created successfully",
    data: newUser,
    accessToken,
    refreshToken,
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
      message: "Invalid password",
    });

  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  return res.status(200).json({
    message: "Login successfully",
    data: user,
    accessToken,
    refreshToken,
  });
};

// find Account by email
const findUserAccount = async (res, req) => {
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

  return res.status(200).json({
    message: "Account found with this email",
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

// forgot Password
const sentVerificationCode = async (req, res) => {
  const { email, type } = req.body;
  if (!email)
    return res.status(400).json({
      message: "Email is required",
    });

  if (!type)
    return res.status(400).json({
      message: "Type is required",
    });

  const user = await schemaForUser.findOne({ email: email });
  if (!user)
    return res.status(404).json({
      message: "No account found with this email",
    });

  const existingVerificationCode = await schemaForVerify.findOne({
    userId: user._id,
  });

  if (existingVerificationCode) {
    return res.status(400).json({
      message: "Verification code already sent",
    });
  }

  const code = generateCode();
  const codeInDb = await schemaForVerify.create({
    userId: user._id,
    verificationCode: code,
  });

  setTimeout(async () => {
    await schemaForVerify.findOneAndDelete({ _id: codeInDb._id });
  }, 60000);

  // Email Design for Email Verification
  const info = await transporter.sendMail({
    from: `"ChatBox Team 👻" <${process.env.MY_EMAIL_ADDRESS}>`,
    to: `${email}`,
    subject: "Verify Your Email for ChatBox",
    html: `${
      type === "email_verification"
        ? `
     <h3>Dear ${user.username},</h3>
      <p>Thank you for registering with <strong>ChatBox</strong>! To complete your registration and activate your account, please enter the verification code provided below:</p>
      <p><strong>Verification Code: ${code}</strong></p>
      <p>This code will expire in <strong>1 minute</strong>. If you did not request this verification, please disregard this email.</p>
      <p>If you need further assistance, feel free to reach out to us at mohammadshahzaib046@gmail.com.</p>
      <br>
      <p>Welcome to the community,</p>
      <p>The <strong>ChatBox</strong> Team</p>`
        : ` <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Your Verification Code</h2>
        <p>Dear ${user.username},</p>
        <p>Your verification code for accessing <strong>ChatBox</strong> is:</p>
        <p><strong style="font-size: 20px;">${code}</strong></p>
        <p>This code is valid for <strong>1 minute</strong>. If you didn’t request this, please ignore this email.</p>
        <p>Best regards,<br>The Your Chat App Team</p>
      </div>`
    }`,
  });

  res.status(200).json({
    message: "Email sent",
    code: codeInDb,
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
  if (type === "email_verification") {
    await schemaForUser.findOneAndUpdate(
      { _id: user._id },
      { isVerified: true }
    );
    return res.status(200).json({ message: "Yur Account has been verified" });
  } else {
    return res.status(200).json({ message: "Code verified" });
  }
};

export {
  getUsers,
  registerUser,
  logInUser,
  findUserAccount,
  refreshAccessToken,
  sentVerificationCode,
  verifyCode,
};
