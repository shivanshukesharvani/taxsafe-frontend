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

  // 2. Local Development Fallback (Safe check without import.meta.env)
  if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
    return "http://localhost:3000";
  }

  // 3. Production Fallback (Hardcoded)
  // Direct link to Azure App Service backend ensures Wizard works without env vars
  return "https://taxsafe-breub7gvavf3fhaa.centralindia-01.azurewebsites.net";
};

export const API_URL = getBaseUrl();

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

// ---------------------------------------------------------------------------
// 🚀 WIZARD API METHODS (Runtime Safe)
// ---------------------------------------------------------------------------

/**
 * Create a new tax submission
 */
export async function createSubmission(submissionData: any): Promise<AnalyzeResponse> {
  const baseUrl = API_URL.replace(/\/$/, "");
  try {
    const response = await fetch(`${baseUrl}/api/submissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submissionData),
    });

    if (!response.ok) throw new Error(`Status ${response.status}`);
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("❌ Create Submission Error:", error);
    return { success: false, message: "Could not create submission. Please try again." };
  }
}

/**
 * Upload salary slip file
 */
export async function uploadSalarySlip(id: string | number, file: File): Promise<AnalyzeResponse> {
  const baseUrl = API_URL.replace(/\/$/, "");
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${baseUrl}/api/submissions/${id}/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error(`Status ${response.status}`);
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("❌ Upload Error:", error);
    return { success: false, message: "File upload failed." };
  }
}

/**
 * Process the submission (Generate Report)
 */
export async function processSubmission(id: string | number): Promise<AnalyzeResponse> {
  const baseUrl = API_URL.replace(/\/$/, "");
  try {
    const response = await fetch(`${baseUrl}/api/submissions/${id}/process`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) throw new Error(`Status ${response.status}`);
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("❌ Process Error:", error);
    return { success: false, message: "Report generation failed." };
  }
}

/**
 * Get submission details
 */
export async function getSubmission(id: string | number): Promise<AnalyzeResponse> {
  const baseUrl = API_URL.replace(/\/$/, "");
  try {
    const response = await fetch(`${baseUrl}/api/submissions/${id}`);
    if (!response.ok) throw new Error(`Status ${response.status}`);
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("❌ Get Submission Error:", error);
    return { success: false, message: "Could not fetch submission." };
  }
}
