import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getAIResponse(userMessage: string, context?: string): Promise<string> {
  try {
    const prompt = context 
      ? `Context: ${context}\n\nUser Question: ${userMessage}\n\nPlease provide a helpful and accurate response for this student/educational query.`
      : `Please provide a helpful and accurate response to this student/educational query: ${userMessage}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "I apologize, but I couldn't generate a response at this time. Please try again later.";
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to get AI response. Please check your connection and try again.');
  }
}

export interface OpportunityRecommendation {
  title: string;
  relevanceScore: number;
  reasoning: string;
}

export async function getOpportunityRecommendations(
  userProfile: any,
  opportunities: any[]
): Promise<OpportunityRecommendation[]> {
  try {
    const profileContext = `User Profile:
    Role: ${userProfile.role}
    Department: ${userProfile.department}
    Branch: ${userProfile.branch}
    Year: ${userProfile.year || 'N/A'}
    Interests: ${userProfile.interests || 'General'}`;

    const opportunitiesText = opportunities.map(opp => 
      `${opp.title} - ${opp.type} - ${opp.description}`
    ).join('\n');

    const prompt = `${profileContext}

Available Opportunities:
${opportunitiesText}

Please analyze and recommend the top 3 most relevant opportunities for this user. Respond in JSON format:
[{"title": "opportunity title", "relevanceScore": 0-100, "reasoning": "why this is relevant"}]`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              relevanceScore: { type: "number" },
              reasoning: { type: "string" }
            },
            required: ["title", "relevanceScore", "reasoning"]
          }
        }
      },
      contents: prompt,
    });

    const rawJson = response.text;
    if (rawJson) {
      return JSON.parse(rawJson);
    }
    return [];
  } catch (error) {
    console.error('Failed to get opportunity recommendations:', error);
    return [];
  }
}

export async function generateSmartNotification(
  userProfile: any,
  eventType: string,
  eventData: any
): Promise<{ title: string; body: string }> {
  try {
    const prompt = `Generate a personalized notification for a ${userProfile.role} in ${userProfile.department}.
    
Event Type: ${eventType}
Event Data: ${JSON.stringify(eventData)}

Create a concise, engaging notification title and body that would be relevant to this user. Respond in JSON format:
{"title": "notification title", "body": "notification body"}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            title: { type: "string" },
            body: { type: "string" }
          },
          required: ["title", "body"]
        }
      },
      contents: prompt,
    });

    const rawJson = response.text;
    if (rawJson) {
      return JSON.parse(rawJson);
    }
    
    return {
      title: "New Update",
      body: "Check out what's happening in KnowZone!"
    };
  } catch (error) {
    console.error('Failed to generate smart notification:', error);
    return {
      title: "New Update",
      body: "Check out what's happening in KnowZone!"
    };
  }
}
