import { useState } from 'react';

const ReportForm = ({ location, onReportSubmitted }) => {
  const [issueType, setIssueType] = useState('no_hot_water');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Submitting...');

    const payload = {
      issue_type: issueType,
      description: description,
      latitude: location.latitude,
      longitude: location.longitude,
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/reports/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setStatus('Success! Issue reported.');
        setDescription('');
        onReportSubmitted();
      } else {
        setStatus('Failed to submit. Please try again.');
      }
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <label style={{ fontWeight: 'bold' }}>Type of Issue:</label>
      <select value={issueType} onChange={(e) => setIssueType(e.target.value)} style={{ padding: '8px' }}>
        <option value="no_hot_water">No Hot Water</option>
        <option value="no_heating">No Heating</option>
        <option value="power_outage">Power Outage</option>
      </select>

      <label style={{ fontWeight: 'bold' }}>Details:</label>
      <textarea 
        value={description} 
        onChange={(e) => setDescription(e.target.value)} 
        placeholder="E.g., Pipe burst outside the local cat cafe..." 
        rows="3" 
        style={{ padding: '8px', resize: 'vertical' }} 
      />

      <button type="submit" style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        Submit Report
      </button>

      {status && <p style={{ fontWeight: 'bold' }}>{status}</p>}
    </form>
  );
};

export default ReportForm;