import { createAccessToken, createRefreshToken } from "../methods/Methods.js";
import { schemaForUser } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// Register User
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name)
    return res.status(400).json({
      message: "Name is required",
    });

  if (!email)
    return res.status(400).json({
      message: "Email is required",
    });

  if (!password)
    return res.status(400).json({
      message: "Password is required",
    });

  const newUser = await schemaForUser.create({
    name,
    email,
    password,
  });

  const accessToken = createAccessToken(newUser);
  const refreshToken = createRefreshToken(newUser);

  return res.status(201).json({
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
    message: "Login successful",
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

export { registerUser, logInUser, findUserAccount, refreshAccessToken };
