import { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, MenuItem, Box, Typography 
} from '@mui/material';

const ReportForm = ({ location, open, onClose, onReportSubmitted }) => {
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
        setStatus(null);
        setDescription('');
        onReportSubmitted();
        onClose();
      } else {
        setStatus('Failed to submit. Please try again.');
      }
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle fontWeight="bold" color="primary.contrastText">
        Report an Issue
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            <TextField
              select
              label="Type of Issue"
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
              fullWidth
            >
              <MenuItem value="no_hot_water">No Hot Water</MenuItem>
              <MenuItem value="no_heating">No Heating</MenuItem>
              <MenuItem value="power_outage">Power Outage</MenuItem>
            </TextField>

            <TextField
              label="Details"
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="E.g., Pipe burst outside the local cat cafe..."
              fullWidth
            />
            
            {status && <Typography color="error" fontWeight="bold">{status}</Typography>}
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose} color="inherit">Cancel</Button>
          <Button type="submit" variant="contained" color="primary" disableElevation>
            Submit Report
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ReportForm;