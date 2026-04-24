import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

class ChatbotAgent:
    def __init__(self, profile_data):
        api_key = os.getenv("GEMINI_API_KEY")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-3-flash-preview')
        self.profile = profile_data

    def get_chat_response(self, user_message):
        system_instruction = f"""
        Anda adalah AI Assistant resmi untuk SMK MADINATUL QURAN (SMK MQ).
        Informasi Sekolah:
        Nama: {self.profile['name']}
        Visi: {self.profile['vision']}
        Misi: {", ".join(self.profile['mission'])}
        Jurusan: {", ".join([d['name'] for d in self.profile['departments']])}
        """
        
        # In actual Python implementation, we'd use start_chat for history
        response = self.model.generate_content(
            f"{system_instruction}\n\nUser: {user_message}",
            generation_config=genai.types.GenerationConfig(temperature=0.7)
        )
        return response.text
