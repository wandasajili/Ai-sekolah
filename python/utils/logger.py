import os
import json
import logging
from datetime import datetime

class Logger:
    def __init__(self):
        self.log_dir = "logs"
        self.log_file = os.path.join(self.log_dir, "activity.log")
        if not os.path.exists(self.log_dir):
            os.makedirs(self.log_dir)

    def log(self, user_id, action, details):
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_entry = f"[{timestamp}] User: {user_id} | Action: {action} | Details: {details}\n"
        with open(self.log_file, "a") as f:
            f.write(log_entry)
        print(log_entry.strip())
