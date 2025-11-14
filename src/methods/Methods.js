import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { transporter } from "../configs/nodemailer.config.js";
import { cloudinary } from "../configs/cloudinary.config.js";
dotenv.config();
const createAccessToken = (user) => {
  const token = jwt.sign(
    { email: user?.email },
    process.env.JWT_ACCESS_TOKEN_SECRET,
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

const uploadImageToCloudinary = async (localFile) => {
  try {
    const response = await cloudinary.uploader.upload(localFile, {
      resource_type: "auto",
    });

    fs.unlink(localFile, (err) => {
      if (err) console.log("Error deleting local file:", err);
    });

    return response.url;
  } catch (error) {
    console.log(error);
    return "Error in uploading file to cloudinary", error;
  }
};

export {
  createAccessToken,
  createRefreshToken,
  generateCode,
  sentEmail,
  uploadImageToCloudinary,
};
