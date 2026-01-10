import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadSalarySlip } from "../services/api";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleUpload() {
    if (!file) {
      alert("Please select a file");
      return;
    }

    setLoading(true);

    try {
      // Use safe mock service
      const res = await uploadSalarySlip(123, file);

      if (res.success) {
        navigate("/report");
      }
    } catch (err) {
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
    </div>
  );
}
