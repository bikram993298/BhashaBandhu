import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getStreamToken } from "../controllers/chat.controller.js";
import Groq from "groq-sdk";
import User from "../models/User.js";

const router = express.Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// AI Language Partner
router.post("/language-partner", protectRoute, async (req, res) => {
  try {
    const { message } = req.body;
    const user = await User.findById(req.user._id);
    
    const prompt = `You are a friendly language exchange partner helping the user learn ${user.targetLanguage || 'Hindi'}. 
The user's native language is ${user.nativeLanguage || 'English'}.

Rules:
- Always reply in ${user.targetLanguage || 'Hindi'} first, then give the translation in ${user.nativeLanguage || 'English'} in brackets
- Keep replies short, natural, conversational — like a real chat friend
- If the user makes a grammar mistake, gently correct it at the end of your reply with "💡 Small correction: ..."
- Never break character. Stay encouraging and warm.
- If the user writes in their native language, nudge them to try in ${user.targetLanguage || 'Hindi'}

User message: "${message}"`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
    });

    res.json({ response: chatCompletion.choices[0]?.message?.content });
  } catch (error) {
    console.error("Language partner error:", error);
    res.status(500).json({ message: "AI service temporarily unavailable" });
  }
});

// Grammar Correction Mode
router.post("/grammar-correction", protectRoute, async (req, res) => {
  try {
    const { message } = req.body;
    const user = await User.findById(req.user._id);
    
    const prompt = `You are a gentle ${user.targetLanguage || 'Hindi'} grammar coach.

The user sent this message: "${message}"

Your job:
- Identify any grammar, spelling, or vocabulary mistakes
- Show the corrected version clearly
- Explain WHY it's wrong in one simple sentence
- Give one example of the correct usage
- Be encouraging, never harsh

Format your reply exactly like this:
✅ Corrected: [corrected message]
📖 Why: [simple explanation]
💬 Example: [one example sentence]`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
    });

    res.json({ response: chatCompletion.choices[0]?.message?.content });
  } catch (error) {
    console.error("Grammar correction error:", error);
    res.status(500).json({ message: "AI service temporarily unavailable" });
  }
});

// Word Explainer
router.post("/word-explainer", protectRoute, async (req, res) => {
  try {
    const { word } = req.body;
    const user = await User.findById(req.user._id);
    
    const prompt = `Explain the ${user.targetLanguage || 'Hindi'} word "${word}" to someone learning the language.

Reply in this exact format:
🔤 Word: ${word}
🗣️ Pronunciation: [romanized pronunciation guide]
📖 Meaning: [simple meaning in ${user.nativeLanguage || 'English'}]
💬 Example: [one short natural example sentence in ${user.targetLanguage || 'Hindi'}]
🌍 Cultural note: [one line about cultural context if relevant, else skip this line]

Keep everything short and beginner-friendly.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
    });

    res.json({ response: chatCompletion.choices[0]?.message?.content });
  } catch (error) {
    console.error("Word explainer error:", error);
    res.status(500).json({ message: "AI service temporarily unavailable" });
  }
});

// Translation Toggle
router.post("/translation", protectRoute, async (req, res) => {
  try {
    const { message, sourceLanguage, targetLanguage } = req.body;
    
    const prompt = `Translate this ${sourceLanguage} message into ${targetLanguage} naturally.

Message: "${message}"

Rules:
- Sound natural, not robotic
- Preserve the tone (casual, formal, funny etc.)
- Only return the translated text, nothing else`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
    });

    res.json({ response: chatCompletion.choices[0]?.message?.content });
  } catch (error) {
    console.error("Translation error:", error);
    res.status(500).json({ message: "AI service temporarily unavailable" });
  }
});

// Cultural Context Tooltip
router.post("/cultural-context", protectRoute, async (req, res) => {
  try {
    const { term } = req.body;
    const user = await User.findById(req.user._id);
    
    const prompt = `The user encountered this term in a conversation: "${term}"

They are learning ${user.targetLanguage || 'Hindi'} and are from ${user.nativeLanguage || 'English'}.

Give a brief cultural explainer in 2-3 sentences maximum:
- What is it?
- Which region/community is it from?
- Why is it significant?

Be warm and curious in tone. No bullet points, just natural flowing text.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
    });

    res.json({ response: chatCompletion.choices[0]?.message?.content });
  } catch (error) {
    console.error("Cultural context error:", error);
    res.status(500).json({ message: "AI service temporarily unavailable" });
  }
});

// Roleplay Scenario
router.post("/roleplay", protectRoute, async (req, res) => {
  try {
    const { scenario } = req.body;
    const user = await User.findById(req.user._id);
    
    const prompt = `You are roleplaying a real-life scenario to help the user practice ${user.targetLanguage || 'Hindi'}.

Scenario: "${scenario}"

Rules:
- You play the other character in the scenario
- Speak only in ${user.targetLanguage || 'Hindi'}
- After each exchange, give a tiny hint in ${user.nativeLanguage || 'English'} if the user seems stuck
- Keep it fun, realistic, and encouraging
- End the roleplay after 6-8 exchanges and give a short score: vocabulary, fluency, confidence out of 5

Start the roleplay now.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
    });

    res.json({ response: chatCompletion.choices[0]?.message?.content });
  } catch (error) {
    console.error("Roleplay error:", error);
    res.status(500).json({ message: "AI service temporarily unavailable" });
  }
});

// Word of the Day
router.post("/word-of-day", protectRoute, async (req, res) => {
  try {
    const { difficulty = 'beginner' } = req.body;
    const user = await User.findById(req.user._id);
    
    const prompt = `Generate a "Word of the Day" story post for a language learning app focused on Indian languages.

Target language: ${user.targetLanguage || 'Hindi'}
Difficulty level: ${difficulty}

Format:
🌟 Word of the Day
[WORD IN TARGET LANGUAGE] /[romanized pronunciation]/
Meaning: [meaning in English/Hindi]
💬 Use it in a sentence: [example sentence]
🎯 Challenge: [one fun micro-challenge using this word]
🌍 Fun fact: [one cultural or linguistic fun fact about this word]

Keep it under 100 words total. Make it feel exciting to learn.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
    });

    res.json({ response: chatCompletion.choices[0]?.message?.content });
  } catch (error) {
    console.error("Word of the day error:", error);
    res.status(500).json({ message: "AI service temporarily unavailable" });
  }
});

// Timed Challenge Judge
router.post("/challenge-judge", protectRoute, async (req, res) => {
  try {
    const { conversationLog } = req.body;
    const user = await User.findById(req.user._id);
    
    const prompt = `The user just completed a 5-minute language challenge where they had to chat only in ${user.targetLanguage || 'Hindi'}.

Here is the full conversation: 
"${conversationLog}"

Evaluate and return:
🎯 Score: X/10
✅ What you did well: [2-3 points]
📖 Mistakes to fix: [2-3 specific corrections]
🔥 Streak words: [3 words they used correctly that were impressive]
💪 Tip for next time: [one actionable advice]

Be like an encouraging coach, not a strict teacher.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
    });

    res.json({ response: chatCompletion.choices[0]?.message?.content });
  } catch (error) {
    console.error("Challenge judge error:", error);
    res.status(500).json({ message: "AI service temporarily unavailable" });
  }
});

router.get("/token", protectRoute, getStreamToken);

export default router;
