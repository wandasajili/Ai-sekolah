import fs from "fs";
import path from "path";

export class Logger {
  private logFile: string;

  constructor() {
    this.logFile = path.join(process.cwd(), "logs", "activity.log");
    const logDir = path.dirname(this.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  log(userId: string, action: string, details: string) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] User: ${userId} | Action: ${action} | Details: ${details}\n`;
    fs.appendFileSync(this.logFile, logEntry);
    console.log(logEntry.trim());
  }
}
