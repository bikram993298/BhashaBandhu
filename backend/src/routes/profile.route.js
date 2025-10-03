import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { protectRoute } from "../middleware/auth.middleware.js";
import User from "../models/User.js";

const router = express.Router();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper function to upload to Cloudinary as a promise
const uploadToCloudinary = (fileBuffer, folder = "profile_pics") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
};

// Update profile route
router.put("/", protectRoute, upload.single("profilePic"), async (req, res) => {
  try {
    const { fullName, bio, nativeLanguage, learningLanguage, location } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.fullName = fullName || user.fullName;
    user.bio = bio || user.bio;
    user.nativeLanguage = nativeLanguage || user.nativeLanguage;
    user.learningLanguage = learningLanguage || user.learningLanguage;
    user.location = location || user.location;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      user.profilePic = result.secure_url;
    }

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
});

export default router;
