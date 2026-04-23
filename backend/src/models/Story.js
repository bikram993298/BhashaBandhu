import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mediaUrl: { type: String }, // Cloudinary URL (image/video)
    mediaType: {
      type: String,
      enum: ["image", "video", "text"],
      required: true,
    },
    textContent: { type: String }, // if text story
    backgroundColor: { type: String, default: "#6366f1" }, // for text stories
    languageTag: {
      type: String,
      required: true,
    }, // e.g., "Tamil", "Hindi"
    viewers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    reactions: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        emoji: { type: String }, // e.g., "❤️", "😂", "😍"
      },
    ],
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24hrs from now
      index: { expires: 0 }, // MongoDB TTL index — auto deletes after expiry!
    },
  },
  { timestamps: true }
);

const Story = mongoose.model("Story", storySchema);

export default Story;
