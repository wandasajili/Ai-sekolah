from fastapi import FastAPI, Query
from pydantic import BaseModel
from agent.chatbot import ChatbotAgent
from agent.search import SearchAgent
from agent.news import NewsAgent
from utils.logger import Logger
import uvicorn

app = FastAPI(title="SMK Madinatul Quran AI Agent API")

logger = Logger()
search_agent = SearchAgent()
news_agent = NewsAgent()
chatbot = ChatbotAgent(search_agent.get_profile())

class ChatRequest(BaseModel):
    message: str

@app.get("/api/profile")
def get_profile():
    logger.log("Guest", "FETCH_PROFILE", "User requested school profile")
    return search_agent.get_profile()

@app.get("/api/news")
def get_news(q: str = Query(None)):
    if q:
        logger.log("Guest", "SEARCH_NEWS", f"User searched news: {q}")
        return news_agent.search_news(q)
    logger.log("Guest", "FETCH_NEWS", "User requested all news")
    return news_agent.get_all_news()

@app.post("/api/chat")
async def chat(request: ChatRequest):
    logger.log("Guest", "AI_CHAT", f"User: {request.message}")
    response = chatbot.get_chat_response(request.message)
    return {"response": response}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=3000)
 lands
