import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Setup JSON parsing with size limits for base64 images
app.use(express.json({ limit: "20mb" }));

// Lazy initializer for Google GenAI to avoid crashing on startup if key is missing
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required to run AI operations.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });
  }
  return aiClient;
}

// 1. Endpoint for AI Image Analysis (Agent 1: Issue Intelligence)
app.post("/api/gemini/analyze-image", async (req, res) => {
  try {
    const { imageBase64, mimeType } = req.body;
    if (!imageBase64 || !mimeType) {
      return res.status(400).json({ error: "Missing imageBase64 or mimeType" });
    }

    const ai = getAiClient();
    
    const prompt = `Analyze this civic issue photo. Your goal is to act as a highly specialized Municipal Diagnostics Agent (Agent 1).
Extract precise details and return a strictly structured JSON response.

Enforce the following JSON structure exactly:
{
  "detectedIssue": "Short, clear description of the specific issue (e.g., Pothole, overflowing drain, ruptured pipe)",
  "severity": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "publicRisk": "Detail the danger to pedestrians, vehicles, disease outbreak risk, environmental damage, or traffic safety.",
  "estimatedRepairCost": "An estimated cost in Indian Rupees (INR) based on typical municipal repair services (e.g. '₹15,000 INR')",
  "estimatedResolutionTime": "Estimated SLA time (e.g., '12 Hours', '24 Hours', '48 Hours')",
  "confidenceScore": 95,
  "responsibleDepartment": "Sanitation & Waste Management" | "Water Supply & Sewage" | "Roads & Infrastructure" | "Electricity & Street Lighting" | "Public Health & Pollution Control" | "Public Safety & Civic Order",
  "environmentalImpact": "Describe any minor or major environmental impact (e.g. soil pollution, methane leak, none)",
  "estimatedCitizensAffected": 150,
  "emergencyRecommendation": "Safety warning or quick recommendation for the neighborhood (e.g., Avoid walking, place hazard warning cones)",
  "professionalTitle": "A highly formal, professionally phrased municipal ticket title (e.g. 'Hazardous structural road degradation')",
  "professionalDescription": "A highly detailed, articulate description of the issue using appropriate municipal planning terminology."
}`;

    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: imageBase64,
      },
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [imagePart, { text: prompt }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedIssue: { type: Type.STRING },
            severity: { type: Type.STRING, enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"] },
            publicRisk: { type: Type.STRING },
            estimatedRepairCost: { type: Type.STRING },
            estimatedResolutionTime: { type: Type.STRING },
            confidenceScore: { type: Type.INTEGER },
            responsibleDepartment: { type: Type.STRING, enum: [
              "Sanitation & Waste Management",
              "Water Supply & Sewage",
              "Roads & Infrastructure",
              "Electricity & Street Lighting",
              "Public Health & Pollution Control",
              "Public Safety & Civic Order"
            ] },
            environmentalImpact: { type: Type.STRING },
            estimatedCitizensAffected: { type: Type.INTEGER },
            emergencyRecommendation: { type: Type.STRING },
            professionalTitle: { type: Type.STRING },
            professionalDescription: { type: Type.STRING },
          },
          required: [
            "detectedIssue",
            "severity",
            "publicRisk",
            "estimatedRepairCost",
            "estimatedResolutionTime",
            "confidenceScore",
            "responsibleDepartment",
            "environmentalImpact",
            "estimatedCitizensAffected",
            "emergencyRecommendation",
            "professionalTitle",
            "professionalDescription"
          ]
        },
        temperature: 0.2,
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response text from Gemini");
    }

    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Gemini Image Analysis Error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze image" });
  }
});

// 2. Endpoint for AI Chat Assistant (CivicAI Assistant)
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { messages, userContext, language } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Missing or invalid messages array" });
    }

    const ai = getAiClient();

    // Map roles & statuses for context injection
    const langLabel = language === "hi" ? "Hindi (हिन्दी)" : "English";
    
    const systemInstruction = `You are CivicPulse AI, a smart, professional municipal assistant for Indian cities.
You communicate in ${langLabel}.
You have direct access to the live municipal complaints database and the user's active session.
Keep responses concise, informative, highly professional, and encouraging. Focus strictly on civic duty.

User Profile:
- Name: ${userContext?.name || "Citizen"}
- City of Residence: ${userContext?.city || "Delhi"}
- Active Civic Points: ${userContext?.points || 350} points
- Account Role: ${userContext?.role || "citizen"}

Active neighborhood complaints in their city:
${JSON.stringify(userContext?.complaintsContext || [])}

Procedures for citizens:
- Earn points: Submit verified issues (+50 pts), verify other neighbor's reports (+15 pts), resolve issues with evidence (+50 pts).
- Redeem points: Metro passes, shopping coupon codes, green transit kits.

Emergency Contacts:
- Municipal Control Room: 1253 (Water logging, Tree fall)
- Electricity Breakdown: 19122 (NDMC cable hazards)
- Delhi Jal Board: 1916 (Sewer bursts, main line leakage)

Formatting: Use markdown bullets and bold text, but keep responses relatively short and direct so it fits beautifully in the chat interface.`;

    // Map history to contents format expected by @google/genai
    const chatContents = messages.map((m: any) => ({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: chatContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Chat Assistant Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate chat response" });
  }
});

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", mode: process.env.NODE_ENV || "development" });
});

// Mount Vite middleware or serve static files
async function setupViteOrStatic() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode serving static files...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[CivicPulse AI] Server listening on http://0.0.0.0:${PORT}`);
  });
}

setupViteOrStatic().catch((err) => {
  console.error("Failed to start server:", err);
});
