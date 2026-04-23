import Story from "../models/Story.js";
import User from "../models/User.js";
import cloudinary from "cloudinary";

// Create Story
export const createStory = async (req, res) => {
  try {
    const { mediaUrl, mediaType, textContent, backgroundColor, languageTag } =
      req.body;

    // Validate required fields
    if (!mediaType || !languageTag) {
      return res
        .status(400)
        .json({ message: "mediaType and languageTag are required" });
    }

    if (mediaType === "text" && !textContent) {
      return res
        .status(400)
        .json({ message: "textContent is required for text stories" });
    }

    if (
      (mediaType === "image" || mediaType === "video") &&
      !mediaUrl
    ) {
      return res
        .status(400)
        .json({ message: "mediaUrl is required for image/video stories" });
    }

    const story = new Story({
      author: req.user.id,
      mediaUrl: mediaType === "text" ? null : mediaUrl,
      mediaType,
      textContent: mediaType === "text" ? textContent : null,
      backgroundColor,
      languageTag,
    });

    await story.save();
    await story.populate("author", "fullName profilePic nativeLanguage");

    res.status(201).json(story);
  } catch (error) {
    console.error("Error creating story:", error);
    res.status(500).json({ message: "Error creating story" });
  }
};

// Get Story Feed (from friends and own)
export const getStoryFeed = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id).populate("friends");

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const friendIds = currentUser.friends.map((f) => f._id);

    // Get non-expired stories from friends and self
    const stories = await Story.find({
      author: { $in: [...friendIds, req.user.id] },
      expiresAt: { $gt: new Date() }, // only non-expired
    })
      .populate("author", "fullName profilePic nativeLanguage")
      .populate("viewers", "_id")
      .populate("reactions.user", "_id fullName")
      .sort({ createdAt: -1 });

    // Group by author
    const grouped = stories.reduce((acc, story) => {
      const key = story.author._id.toString();
      if (!acc[key]) {
        acc[key] = {
          author: story.author,
          stories: [],
          hasUnviewed: false,
        };
      }

      // Check if current user has viewed this story
      const hasViewed = story.viewers.some(
        (viewer) => viewer._id.toString() === req.user.id
      );

      acc[key].stories.push({
        ...story.toObject(),
        hasViewed,
      });

      // Mark as unviewed if any story is unviewed
      if (!hasViewed) {
        acc[key].hasUnviewed = true;
      }

      return acc;
    }, {});

    res.json(Object.values(grouped));
  } catch (error) {
    console.error("Error fetching story feed:", error);
    res.status(500).json({ message: "Error fetching story feed" });
  }
};

// View Story (track viewer)
export const viewStory = async (req, res) => {
  try {
    const { storyId } = req.params;

    const story = await Story.findById(storyId).populate(
      "viewers",
      "_id fullName profilePic"
    );

    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    // Add viewer if not already viewed
    if (!story.viewers.some((viewer) => viewer._id.toString() === req.user.id)) {
      story.viewers.push(req.user.id);
      await story.save();
    }

    res.json(story);
  } catch (error) {
    console.error("Error viewing story:", error);
    res.status(500).json({ message: "Error viewing story" });
  }
};

// React to Story
export const reactToStory = async (req, res) => {
  try {
    const { storyId } = req.params;
    const { emoji } = req.body;

    if (!emoji) {
      return res.status(400).json({ message: "emoji is required" });
    }

    const story = await Story.findById(storyId);

    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    // Check if user already reacted
    const existingReaction = story.reactions.find(
      (r) => r.user.toString() === req.user.id
    );

    if (existingReaction) {
      existingReaction.emoji = emoji;
    } else {
      story.reactions.push({
        user: req.user.id,
        emoji,
      });
    }

    await story.save();
    await story.populate("reactions.user", "_id fullName profilePic");

    res.json(story);
  } catch (error) {
    console.error("Error reacting to story:", error);
    res.status(500).json({ message: "Error reacting to story" });
  }
};

// Get Story Viewers
export const getStoryViewers = async (req, res) => {
  try {
    const { storyId } = req.params;

    const story = await Story.findById(storyId)
      .populate("viewers", "fullName profilePic")
      .populate("author");

    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    // Only author can view viewers
    if (story.author._id.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to view story viewers" });
    }

    res.json({
      storyId: story._id,
      viewCount: story.viewers.length,
      viewers: story.viewers,
    });
  } catch (error) {
    console.error("Error fetching story viewers:", error);
    res.status(500).json({ message: "Error fetching story viewers" });
  }
};

// Delete Story
export const deleteStory = async (req, res) => {
  try {
    const { storyId } = req.params;

    const story = await Story.findById(storyId);

    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    // Only author can delete
    if (story.author.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this story" });
    }

    // Delete image/video from cloudinary if exists
    if (story.mediaUrl && (story.mediaType === "image" || story.mediaType === "video")) {
      try {
        const publicId = story.mediaUrl.split("/").pop().split(".")[0];
        await cloudinary.v2.uploader.destroy(publicId);
      } catch (err) {
        console.error("Error deleting from cloudinary:", err);
      }
    }

    await Story.findByIdAndDelete(storyId);

    res.json({ message: "Story deleted successfully" });
  } catch (error) {
    console.error("Error deleting story:", error);
    res.status(500).json({ message: "Error deleting story" });
  }
};

// Get User's Own Stories
export const getUserStories = async (req, res) => {
  try {
    const stories = await Story.find({
      author: req.user.id,
      expiresAt: { $gt: new Date() }, // only non-expired
    })
      .populate("viewers", "_id fullName profilePic")
      .populate("reactions.user", "_id fullName profilePic")
      .sort({ createdAt: -1 });

    res.json(stories);
  } catch (error) {
    console.error("Error fetching user stories:", error);
    res.status(500).json({ message: "Error fetching user stories" });
  }
};
