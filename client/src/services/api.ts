const API_URL = import.meta.env.VITE_API_URL as string;

if (!API_URL) {
  throw new Error("❌ VITE_API_URL is not defined. Check client/.env");
}

export interface AnalyzeResponse {
  success: boolean;
  data?: unknown;
  message?: string;
}

export async function analyzeTest(): Promise<AnalyzeResponse> {
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
    throw new Error(
      `API Error ${response.status}: ${errorText || "Request failed"}`
    );
  }

  // ✅ Safe JSON parsing
  try {
    return await response.json();
  } catch {
    throw new Error("Invalid JSON response from API");
  }
}
