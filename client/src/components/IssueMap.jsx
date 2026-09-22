import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const whitePinIcon = L.divIcon({
  className: 'custom-white-pin',
  html: `<div style="
    background-color: #ffffff; 
    border: 3px solid #2e303a; 
    width: 16px; 
    height: 16px; 
    border-radius: 50%; 
    box-shadow: 0 2px 5px rgba(0,0,0,0.4);
  "></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
  popupAnchor: [0, -10]
});

const IssueMap = ({ location, reports = [] }) => {
  const position = [location.latitude, location.longitude];

  return (
    <Box sx={{ mt: 2, border: '3px solid #2e303a', borderRadius: '12px', overflow: 'hidden' }}>
      <MapContainer center={position} zoom={14} style={{ height: '400px', width: '100%', zIndex: 1 }}>
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <Marker position={position} icon={whitePinIcon}>
          <Popup><strong>You are here</strong></Popup>
        </Marker>

        {reports.map((report) => (
          <Marker key={report.id} position={[report.latitude, report.longitude]} icon={whitePinIcon}>
            <Popup>
              <strong>Issue:</strong> {report.issue_type.replace('_', ' ')} <br />
              <strong>Details:</strong> {report.description || 'No description provided.'}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
};

export default IssueMap;