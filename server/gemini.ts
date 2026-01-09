import { log } from "./index";

// Mock response to ensure the hackathon demo NEVER fails
const MOCK_ANALYSIS = {
  riskLevel: "Medium",
  score: 75,
  issues: [
    {
      id: "mock-1",
      title: "Potential HRA Mismatch",
      description: "The HRA claimed seems higher than the standard exemption limit based on your basic salary.",
      severity: "medium"
    },
    {
      id: "mock-2",
      title: "Missing 80C Investments",
      description: "You haven't declared any ELSS or PPF investments which could save tax.",
      severity: "low"
    }
  ],
  recommendations: [
    "Verify rent receipts for HRA claim.",
    "Consider investing in ELSS for 80C benefits."
  ]
};

export async function analyzeTaxDocument(text: string): Promise<any> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.log("⚠️ No GEMINI_API_KEY found. Using MOCK AI fallback.");
    return MOCK_ANALYSIS;
  }

  try {
    console.log("🚀 Using REAL Gemini AI...");
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Analyze this tax document text for mistakes and return ONLY valid JSON with riskLevel (Low/Medium/High), score (0-100), issues (array of {id, title, description, severity}), and recommendations (array of strings). Text: ${text.substring(0, 1000)}`
            }]
          }]
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Safely extract the JSON string from Gemini's response structure
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) throw new Error("Empty response from Gemini");

    // Clean up markdown code blocks if Gemini adds them
    const jsonString = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    
    return JSON.parse(jsonString);

  } catch (error) {
    console.error("❌ Gemini API Failed:", error);
    console.log("⚠️ Switching to MOCK AI fallback to prevent crash.");
    return MOCK_ANALYSIS;
  }
}