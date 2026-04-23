import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createStory,
  getStoryFeed,
  viewStory,
  reactToStory,
  getStoryViewers,
  deleteStory,
  getUserStories,
} from "../controllers/story.controller.js";

const router = express.Router();

// Create story
router.post("/", protectRoute, createStory);

// Get story feed (all friends' stories)
router.get("/feed", protectRoute, getStoryFeed);

// Get user's own stories
router.get("/user/stories", protectRoute, getUserStories);

// View a story (tracks viewer)
router.get("/:storyId", protectRoute, viewStory);

// Get story viewers (only author can view)
router.get("/:storyId/viewers", protectRoute, getStoryViewers);

// React to story
router.post("/:storyId/react", protectRoute, reactToStory);

// Delete story
router.delete("/:storyId", protectRoute, deleteStory);

export default router;
