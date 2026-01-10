import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Report() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: '#16a34a', marginBottom: '1rem' }}>Tax Analysis Complete</h1>
      
      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Issues Detected</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ background: '#fef2f2', padding: '1rem', borderRadius: '4px', marginBottom: '0.5rem', borderLeft: '4px solid #ef4444' }}>
            <div style={{ fontWeight: 'bold', color: '#991b1b' }}>⚠️ HRA Mismatch</div>
            <div style={{ color: '#b91c1c' }}>Declared HRA (₹20,000) does not match salary slip (₹15,000).</div>
          </li>
          <li style={{ background: '#fefce8', padding: '1rem', borderRadius: '4px', borderLeft: '4px solid #eab308' }}>
            <div style={{ fontWeight: 'bold', color: '#854d0e' }}>⚠️ 80C Limit Exceeded</div>
            <div style={{ color: '#a16207' }}>Total deductions exceed ₹1.5L limit by ₹10,000.</div>
          </li>
        </ul>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button 
          onClick={() => alert("Downloading Report...")}
          style={{ background: '#2563eb', color: 'white', padding: '0.5rem 1.5rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Download PDF Report
        </button>
        <button 
          onClick={() => navigate('/')}
          style={{ background: 'transparent', color: '#4b5563', padding: '0.5rem 1.5rem', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer' }}
        >
          Start Over
        </button>
      </div>
    </div>
  );
}