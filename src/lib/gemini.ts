import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface TaskInsight {
  priority: 'urgent-important' | 'important-not-urgent' | 'urgent-not-important' | 'neither';
  reasoning: string;
  suggestedFocusTime: number; // in minutes
  breakSuggestion: string;
}

export async function analyzeTask(taskTitle: string, taskDescription: string): Promise<TaskInsight> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze this task for an ADHD user and categorize it into the Eisenhower Matrix.
    Task Title: ${taskTitle}
    Task Description: ${taskDescription}
    
    Provide:
    1. Quadrant (urgent-important, important-not-urgent, urgent-not-important, neither)
    2. Reasoning (ADHD-friendly, concise)
    3. Suggested focus time (minutes)
    4. A break suggestion to keep energy up.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          priority: {
            type: Type.STRING,
            enum: ['urgent-important', 'important-not-urgent', 'urgent-not-important', 'neither'],
          },
          reasoning: { type: Type.STRING },
          suggestedFocusTime: { type: Type.NUMBER },
          breakSuggestion: { type: Type.STRING },
        },
        required: ['priority', 'reasoning', 'suggestedFocusTime', 'breakSuggestion'],
      },
    },
  });

  return JSON.parse(response.text);
}
