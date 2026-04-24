import { GoogleGenAI } from "@google/genai";
import schoolProfile from "../../database/school_profile.json";

export class ChatbotAgent {
  private ai: GoogleGenAI;
  private modelName: string = "gemini-3-flash-preview";

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured");
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  async getChatResponse(message: string): Promise<string> {
    const systemInstruction = `
      Anda adalah AI Assistant resmi untuk SMK MADINATUL QURAN (SMK MQ).
      Tugas Anda adalah membantu wali murid, siswa, dan calon siswa.
      
      Informasi Sekolah:
      Nama: ${schoolProfile.name}
      Visi: ${schoolProfile.vision}
      Misi: ${schoolProfile.mission.join(", ")}
      Jurusan: ${schoolProfile.departments.map(d => d.name).join(", ")}
      Alamat: ${schoolProfile.contact.address}
      
      Aturan:
      1. Jawablah dengan sopan dan ramah.
      2. Jika ditanya informasi sekolah, gunakan data di atas.
      3. Jika informasi tidak ada, arahkan untuk menghubungi kontak resmi: ${schoolProfile.contact.phone}.
      4. Gunakan Bahasa Indonesia yang baik dan benar.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: this.modelName,
        contents: [{ role: "user", parts: [{ text: message }] }],
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      return response.text || "Maaf, saya sedang mengalami kendala teknis. Silakan coba lagi nanti.";
    } catch (error) {
      console.error("Chatbot Error:", error);
      return "Maaf, saya tidak dapat merespons saat ini.";
    }
  }
}
