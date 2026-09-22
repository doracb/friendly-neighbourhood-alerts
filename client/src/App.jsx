import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Typography, Button, Fade, ToggleButton, ToggleButtonGroup, TextField } from '@mui/material';
import AddAlertIcon from '@mui/icons-material/AddAlert';
import MyLocationIcon from '@mui/icons-material/MyLocation';
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
    fontFamily: '"Nunito", "Roboto", "Helvetica", sans-serif',
  },
})

function App() {
  const { location, error, loading, getLocation } = useGeolocation();
  const [reports, setReports] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

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
    getLocation();
    fetchReports();
  }, []);

  useEffect(() => {
    if (location) {
      const timer = setTimeout(() => setShowSplash(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [location]);

  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setActiveFilter(newFilter);
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesCategory = activeFilter === 'all' || report.issue_type === activeFilter;
    
    const lowerCaseQuery = searchQuery.toLowerCase();
    const matchesSearch = 
      report.issue_type.toLowerCase().includes(lowerCaseQuery) ||
      (report.description && report.description.toLowerCase().includes(lowerCaseQuery));

    return matchesCategory && matchesSearch;
  });

  if (showSplash) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Fade in={showSplash} timeout={800}>
          <Box sx={{ 
            height: '100vh', display: 'flex', flexDirection: 'column', 
            justifyContent: 'center', alignItems: 'center', textAlign: 'center', p: 3 
          }}>
            <img 
              src="/icon-192x192.png" 
              alt="Friendly Neighbourhood Alerts" 
              style={{ width: '250px', imageRendering: 'pixelated' }} 
            />
          </Box>
        </Fade>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> 
      <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: '600px', mx: 'auto', textAlign: 'center' }}>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          gap: 2,
          mb: 2 
        }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: '900', 
              color: '#2e303a', 
              textTransform: 'uppercase',
              textAlign: 'left',
              lineHeight: 1.2
            }}
          >
            Harta Incidentelor
          </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            startIcon={<AddAlertIcon />}
            onClick={() => setIsModalOpen(true)}
            disableElevation
            sx={{ borderRadius: '8px', fontWeight: 'bold', minWidth: 'max-content' }}
          >
            Raportează
          </Button>
        </Box>

        {location && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
            <TextField
              placeholder="Caută după cuvinte cheie (ex: țeavă, curent)..."
              variant="outlined"
              size="small"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ backgroundColor: '#ffffff', borderRadius: 1 }}
            />

            <ToggleButtonGroup
              value={activeFilter}
              exclusive
              onChange={handleFilterChange}
              fullWidth
              size="small"
              sx={{ backgroundColor: '#fff', borderRadius: '8px' }}
            >
              <ToggleButton value="all" sx={{ fontWeight: 'bold' }}>Toate</ToggleButton>
              <ToggleButton value="no_hot_water" sx={{ fontWeight: 'bold' }}>Apă</ToggleButton>
              <ToggleButton value="no_heating" sx={{ fontWeight: 'bold' }}>Căldură</ToggleButton>
              <ToggleButton value="power_outage" sx={{ fontWeight: 'bold' }}>Curent</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        )}

        {error && <Typography color="error" sx={{ mt: 2 }}>Error: {error}</Typography>}
        
        {location && (
          <Box sx={{ textAlign: 'left' }}>
            <IssueMap location={location} reports={filteredReports} />
            <ReportForm 
              location={location} 
              open={isModalOpen} 
              onClose={() => setIsModalOpen(false)}
              onReportSubmitted={fetchReports} 
            />
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;