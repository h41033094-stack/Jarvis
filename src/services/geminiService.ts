import { GoogleGenAI } from "@google/genai";
import { JARVIS_SYSTEM_PROMPT } from "../constants";
import { Message } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function jarvisChat(messages: Message[], systemInstruction?: string) {
  if (!process.env.GEMINI_API_KEY) {
    return "I'm sorry, Sir, but my cognitive core is not currently receiving an API connection. Please check the environment configuration.";
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      })),
      config: {
        systemInstruction: systemInstruction || JARVIS_SYSTEM_PROMPT,
        temperature: 0.8,
        topP: 0.95,
        tools: [
          { googleSearch: {} }
        ],
        toolConfig: { 
          includeServerSideToolInvocations: true 
        }
      },
    });

    return response.text || "I processed your request, but I seem to be at a loss for words, Sir.";
  } catch (error) {
    console.error("Jarvis Error:", error);
    return "I apologize, Sir. There was a disturbance in my logic processors. I'm unable to complete that request at the moment.";
  }
}

export async function summarizeDocument(text: string, length: 'short' | 'medium' | 'detailed') {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Summarize the following document. The summary should be ${length}. \n\nDocument:\n${text}`,
      config: {
        systemInstruction: JARVIS_SYSTEM_PROMPT,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Summary Error:", error);
    return "I'm afraid I encountered an error while indexing the document, Sir.";
  }
}

export async function verifyOwner(base64Image: string, ownerDescription?: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { text: `Identify if the person in this image is the authorized system owner. ${ownerDescription ? `The owner is described as: ${ownerDescription}` : "The owner is Tony Stark."} Respond with "AUTHORIZED" if it is the owner, or "UNAUTHORIZED" if it is someone else. Also provide a brief reason.` },
          { inlineData: { mimeType: "image/jpeg", data: base64Image } }
        ]
      },
      config: {
        systemInstruction: JARVIS_SYSTEM_PROMPT,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Verification Error:", error);
    return "Error during identity verification.";
  }
}

export async function analyzeVision(base64Image: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { text: "Analyze this camera frame. Detect movement, identify the person (if known, else describe them), and scan for any security threats. Respond as J.A.R.V.I.S." },
          { inlineData: { mimeType: "image/jpeg", data: base64Image } }
        ]
      },
      config: {
        systemInstruction: JARVIS_SYSTEM_PROMPT,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Vision Error:", error);
    return "Visual sensor malfunction, Sir.";
  }
}

export async function fetchRealTimeNews(preferences: string[]) {
  try {
    const prompt = `Fetch the latest high-tech, science, and global news based on these topics: ${preferences.join(", ")}. Return a JSON array of 3 NewsArticle objects with fields: id, title, summary, source, url, topic, timestamp (number), and sentiment. Return ONLY the JSON.`;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: JARVIS_SYSTEM_PROMPT,
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json"
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("News Fetch Error:", error);
    return [];
  }
}

export async function fetchRealTimeWeather(lat: number, lon: number) {
  try {
    const prompt = `What is the current exact weather at coordinates ${lat}, ${lon}? Provide a short summary like "Clear Skies, 72°F".`;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: JARVIS_SYSTEM_PROMPT,
        tools: [{ googleSearch: {} }]
      }
    });
    return response.text || "Status Unknown";
  } catch (error) {
    console.error("Weather Fetch Error:", error);
    return "Sensor Malfunction";
  }
}
