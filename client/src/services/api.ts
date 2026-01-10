// Define global window interface for runtime config
declare global {
  interface Window {
    RUNTIME_CONFIG?: {
      API_URL?: string;
    };
  }
}

// 🔧 API CONFIGURATION
// Handles missing env vars by falling back to relative paths or defaults
const getBaseUrl = (): string => {
  // 1. Runtime Config (Window Injection) - Safe for Azure SWA
  if (typeof window !== "undefined" && window.RUNTIME_CONFIG?.API_URL) {
    return window.RUNTIME_CONFIG.API_URL;
  }

  // 2. Local Development Fallback
  if (import.meta.env.DEV) {
    return "http://localhost:3000";
  }

  // 3. Production Fallback (Hardcoded)
  // Direct link to Azure App Service backend ensures Wizard works without env vars
  return "https://taxsafe-breub7gvavf3fhaa.centralindia-01.azurewebsites.net";
};

const API_URL = getBaseUrl();

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
  // Ensure no double slash if API_URL ends with /
  const baseUrl = API_URL.replace(/\/$/, "");

  try {
    const response = await fetch(`${baseUrl}/api/analyze`, {
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
