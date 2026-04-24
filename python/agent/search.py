import json
import os

class SearchAgent:
    def __init__(self, db_path="database/school_profile.json"):
        if not os.path.exists(db_path):
            # Fallback path if run from project root
            db_path = os.path.join(os.path.dirname(__file__), "..", db_path)
            
        with open(db_path, "r", encoding="utf-8") as f:
            self.profile = json.load(f)

    def get_profile(self):
        return self.profile

    def search_facilities(self, query):
        return [f for f in self.profile["facilities"] if query.lower() in f.lower()]

    def get_department_info(self, dept_id):
        return next((d for d in self.profile["departments"] if d["id"] == dept_id), None)
