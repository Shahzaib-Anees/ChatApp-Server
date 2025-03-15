import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { transporter } from "../configs/nodemailer.config.js";
dotenv.config();
const createAccessToken = (user) => {
  const token = jwt.sign(
    { email: user?.email },
    process.env.JWT_ACCESSS_TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  );

  return token;
};

const createRefreshToken = (user) => {
  const token = jwt.sign(
    { email: user?.email },
    process.env.JWT_REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );
  return token;
};

// Upload Image
// Cloudinary Configs
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
    });
    return result?.url;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const generateCode = () => {
  let code = [];
  for (let i = 0; i < 4; i++) {
    const randomNumber = Math.floor(Math.random() * 10);
    code.push(randomNumber);
  }

  return code.join("");
};

const sentEmail = async (email, subject, emailContent) => {
  try {
    const smtpResponse = await transporter.sendMail({
      from: `"ChatBox Team 👻" <${process.env.MY_EMAIL_ADDRESS}>`,
      to: `${email}`,
      subject: `${subject}`,
      html: `${emailContent}`,
    });

    return smtpResponse;
  } catch (error) {
    return error;
  }
};

export {
  createAccessToken,
  createRefreshToken,
  uploadImage,
  generateCode,
  sentEmail,
};
