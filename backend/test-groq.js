import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

console.log("🔍 Testing Groq API Key...");
console.log("API Key length:", process.env.GROQ_API_KEY?.length || 0);
console.log("API Key starts with:", process.env.GROQ_API_KEY?.substring(0, 10) + "...");

async function testAPI() {
  try {
    console.log("📡 Making API call...");
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: "Hello, just testing the API" }],
      model: "llama-3.1-8b-instant",
    });

    console.log("✅ SUCCESS! API key is working");
    console.log("Response preview:", chatCompletion.choices[0]?.message?.content?.substring(0, 50) + "...");
  } catch (error) {
    console.log("❌ API ERROR:", error.message);

    if (error.status) {
      console.log("Status code:", error.status);
    }

    if (error.response?.data) {
      console.log("Error details:", JSON.stringify(error.response.data, null, 2));
    }

    // Common error interpretations
    if (error.message.includes("401")) {
      console.log("🔑 POSSIBLE CAUSES:");
      console.log("  - API key is invalid or expired");
      console.log("  - API key doesn't have proper permissions");
      console.log("  - You may need to regenerate your API key");
    } else if (error.message.includes("429")) {
      console.log("⏱️  POSSIBLE CAUSES:");
      console.log("  - Rate limit exceeded");
      console.log("  - Monthly quota exceeded");
      console.log("  - Try again later or upgrade your plan");
    } else if (error.message.includes("network") || error.message.includes("ECONNREFUSED")) {
      console.log("🌐 POSSIBLE CAUSES:");
      console.log("  - Network connectivity issues");
      console.log("  - Groq API servers are down");
      console.log("  - Check your internet connection");
    }
  }
}

testAPI();