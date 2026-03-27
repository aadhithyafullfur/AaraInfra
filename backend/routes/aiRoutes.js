const express = require("express");

const router = express.Router();

router.post("/chat", async (req, res) => {
  try {
    const { messages = [], model = "llama-3.1-8b-instant", temperature = 0.7, max_tokens = 500 } = req.body || {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: "Messages are required" });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: "AI service is not configured" });
    }

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens,
      }),
    });

    const data = await groqResponse.json();

    if (!groqResponse.ok) {
      return res.status(groqResponse.status).json({
        message: data?.error?.message || "Failed to connect to AI",
      });
    }

    const botResponse = data?.choices?.[0]?.message?.content;
    if (!botResponse) {
      return res.status(502).json({ message: "AI response was empty" });
    }

    return res.json({ reply: botResponse });
  } catch (error) {
    console.error("AI chat proxy error:", error.message);
    return res.status(500).json({ message: "Failed to connect to AI" });
  }
});

module.exports = router;
