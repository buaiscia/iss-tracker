import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import "./App.css";

// Fix for default marker icon in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function App() {
  const [issPosition, setIssPosition] = useState({ latitude: 0, longitude: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchISSPosition = async () => {
      try {
        const response = await fetch("http://api.open-notify.org/iss-now.json");
        const data = await response.json();
        setIssPosition({
          latitude: parseFloat(data.iss_position.latitude),
          longitude: parseFloat(data.iss_position.longitude),
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching ISS position:", error);
        setLoading(false);
      }
    };

    fetchISSPosition();
    const interval = setInterval(fetchISSPosition, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="iss-tracker">
      <h1>ISS Location Tracker</h1>
      {loading ? (
        <div className="loading">Loading ISS position...</div>
      ) : (
        <div className="content-container">
          <div className="position-container">
            <div className="position-card">
              <h2>Current Position</h2>
              <div className="coordinates">
                <p>
                  <span>Latitude:</span> {issPosition.latitude.toFixed(4)}°
                </p>
                <p>
                  <span>Longitude:</span> {issPosition.longitude.toFixed(4)}°
                </p>
              </div>
            </div>
          </div>
          <div className="map-container">
            <MapContainer
              center={[issPosition.latitude, issPosition.longitude]}
              zoom={3}
              style={{ height: "400px", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[issPosition.latitude, issPosition.longitude]}>
                <Popup>International Space Station</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
