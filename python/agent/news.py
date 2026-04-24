import json
import os

class NewsAgent:
    def __init__(self, db_path="database/news.json"):
        if not os.path.exists(db_path):
            db_path = os.path.join(os.path.dirname(__file__), "..", db_path)
            
        with open(db_path, "r", encoding="utf-8") as f:
            self.news = json.load(f)

    def get_all_news(self):
        return self.news

    def search_news(self, query):
        q = query.lower()
        return [n for n in self.news if q in n["title"].lower() or q in n["summary"].lower() or q in n["category"].lower()]
