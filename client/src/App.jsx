import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import useGeolocation from './hooks/useGeolocation';
import IssueMap from './components/IssueMap';
import ReportForm from './components/ReportForm';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FFCB56',
      contrastText: '#2e303a',
    },
    secondary: {
      main: '#FFA259',
    },
    error: {
      main: '#FF7E7E',
    },
    background: {
      default: '#FFEDB9',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
})

function App() {
  const { location, error, loading, getLocation } = useGeolocation();
  const [reports, setReports] = useState([]);

  const fetchReports = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/reports/');
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      }
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> 
      
      <Box sx={{ p: 3, maxWidth: '600px', mx: 'auto' }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" color="#2e303a">
          Friendly Neighbourhood Alerts
        </Typography>
        
        <button onClick={getLocation} disabled={loading}>
          {loading ? 'Locating...' : 'Report Issue Here'}
        </button>

        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        
        {location && (
          <Box sx={{ mt: 3 }}>
            <IssueMap location={location} reports={reports} />
            <ReportForm location={location} onReportSubmitted={fetchReports} />
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;