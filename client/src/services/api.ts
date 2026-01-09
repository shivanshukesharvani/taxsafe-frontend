// Read API URL from Vite environment
const API_URL = import.meta.env.VITE_API_URL as string | undefined;

export interface AnalyzeResponse {
  success: boolean;
  data?: unknown;
  message?: string;
}

/**
 * Call backend analyze API safely
 * - No app crash if env is missing
 * - Handles network / HTTP / JSON errors gracefully
 */
export async function analyzeTest(): Promise<AnalyzeResponse> {
  // ✅ ENV SAFETY (NO THROW)
  if (!API_URL) {
    console.error("❌ VITE_API_URL is not defined");
    return {
      success: false,
      message: "Backend API is not configured",
    };
  }

  try {
    const response = await fetch(`${API_URL}/api/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ test: true }),
    });

    // ❌ HTTP error (4xx / 5xx)
    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        message: `API Error ${response.status}: ${
          errorText || "Request failed"
        }`,
      };
    }

    // ✅ Safe JSON parsing
    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("❌ Network / Runtime error:", error);
    return {
      success: false,
      message: "Failed to connect to backend",
    };
  }
}
