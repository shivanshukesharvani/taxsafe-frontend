const API_URL = import.meta.env.VITE_API_URL;

export async function analyzeTest() {
  const res = await fetch(`${API_URL}/api/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ test: true }),
  });

  if (!res.ok) {
    throw new Error("API request failed");
  }

  return res.json();
}
