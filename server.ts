import 'dotenv/config';
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { ChatbotAgent } from "./src/agent/chatbot.ts";
import { SearchAgent } from "./src/agent/search.ts";
import { NewsAgent } from "./src/agent/news.ts";
import { Logger } from "./src/utils/logger.ts";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Agents
  const chatbot = new ChatbotAgent();
  const searchAgent = new SearchAgent();
  const newsAgent = new NewsAgent();
  const logger = new Logger();

  // API Routes
  app.get("/api/profile", (req, res) => {
    logger.log("Guest", "FETCH_PROFILE", "User requested school profile");
    res.json(searchAgent.getProfile());
  });

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

  app.post("/api/chat", async (req, res) => {
    const { message } = req.body;
    logger.log("Guest", "AI_CHAT", `User: ${message}`);
    const response = await chatbot.getChatResponse(message);
    res.json({ response });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
