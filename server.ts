import 'dotenv/config';
import express from "express";
import cors from "cors";
import path from "path";
import { ChatbotAgent } from "./src/agent/chatbot.ts";
import { SearchAgent } from "./src/agent/search.ts";
import { NewsAgent } from "./src/agent/news.ts";
import { Logger } from "./src/utils/logger.ts";

async function startServer() {
  const app = express();

  // ✅ FIX UTAMA: pakai PORT dari Railway
  const PORT = process.env.PORT || 3000;

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Initialize Agents
  const chatbot = new ChatbotAgent();
  const searchAgent = new SearchAgent();
  const newsAgent = new NewsAgent();
  const logger = new Logger();

  // ================= API ROUTES =================

  // Profile
  app.get("/api/profile", (req, res) => {
    logger.log("Guest", "FETCH_PROFILE", "User requested school profile");
    res.json(searchAgent.getProfile());
  });

  // News
  app.get("/api/news", (req, res) => {
    const query = req.query.q as string;

    if (query) {
      logger.log("Guest", "SEARCH_NEWS", `User searched news: ${query}`);
      res.json(newsAgent.searchNews(query));
    } else {
      logger.log("Guest", "FETCH_NEWS", "User requested all news");
      res.json(newsAgent.getAllNews());
    }
  });

  // Chat AI
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;

      logger.log("Guest", "AI_CHAT", `User: ${message}`);

      const response = await chatbot.getChatResponse(message);

      res.json({ response });
    } catch (error) {
      console.error("Chat Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ================= STATIC FILE (OPTIONAL) =================

  // Kalau kamu build frontend (vite build)
  const distPath = path.join(process.cwd(), "dist");

  app.use(express.static(distPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });

  // ================= START SERVER =================

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

startServer();