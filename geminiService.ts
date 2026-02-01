
import { GoogleGenAI, Type } from "@google/genai";
import { GraphData, AnalysisResult } from "../types";

// Initialize the Google GenAI client using the provided API key
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeGraphTopology = async (data: GraphData): Promise<AnalysisResult> => {
  const nodeSummary = data.nodes
    .slice(0, 10)
    .map(n => `ID: ${n.id}, Risk: ${n.suspicionScore}, Tags: ${n.tags.join(', ')}`)
    .join('\n');

  const prompt = `
    You are a Blockchain Forensic Expert. Analyze the following transaction subgraph data for potential money laundering:
    
    ${nodeSummary}
    
    The graph contains ${data.nodes.length} nodes and ${data.links.length} edges.
    Look for:
    1. "Smurfing": Large sum broken into small transactions (Fan-out).
    2. "Gathering": Small transactions re-aggregating in one wallet (Fan-in).
    3. "Peeling Chains": Small deductions for gas fees at each hop.
    
    Provide a detailed JSON analysis.
  `;

  try {
    // Upgraded to gemini-3-pro-preview for complex reasoning tasks in blockchain forensics
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            topologyDetected: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            riskAssessment: { 
              type: Type.STRING, 
              description: "Low, Medium, High, or Critical" 
            },
            reasoning: { type: Type.STRING }
          },
          required: ["summary", "topologyDetected", "riskAssessment", "reasoning"]
        }
      }
    });

    const jsonStr = response.text?.trim();
    if (!jsonStr) {
      throw new Error("Received empty response from the AI model.");
    }
    
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      summary: "Error generating automated analysis.",
      topologyDetected: ["Unknown"],
      riskAssessment: "Medium",
      reasoning: "The model was unable to process the graph structure at this time."
    };
  }
};
