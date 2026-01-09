import { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function Upload() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleUpload() {
    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file); // 🔑 must be 'file'

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert("Upload failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Tax Filing Mistake Checker</h2>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <button onClick={handleUpload}>
        {loading ? "Analyzing..." : "Upload & Analyze"}
      </button>

      {result && (
        <pre style={{ marginTop: 20 }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
