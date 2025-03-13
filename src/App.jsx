import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
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
  const [groundTrack, setGroundTrack] = useState([]);

  useEffect(() => {
    const fetchISSPosition = async () => {
      try {
        const response = await fetch("http://api.open-notify.org/iss-now.json");
        const data = await response.json();
        const latitude = parseFloat(data.iss_position.latitude);
        const longitude = parseFloat(data.iss_position.longitude);

        setIssPosition({
          latitude,
          longitude,
        });

        // Fetch the ground track
        fetchGroundTrack();

        setLoading(false);
      } catch (error) {
        console.error("Error fetching ISS position:", error);
        setLoading(false);
      }
    };

    const fetchGroundTrack = async () => {
      try {
        // Generate timestamps for the next 90 minutes (one orbit)
        // We'll request positions at 2-minute intervals
        const now = Math.floor(Date.now() / 1000); // Current time in seconds
        const timestamps = [];

        // Create 45 timestamps at 2-minute intervals (90 minutes total)
        for (let i = 0; i < 45; i++) {
          timestamps.push(now + i * 120); // 120 seconds = 2 minutes
        }

        // The API allows up to 10 timestamps per request, so we need to make multiple requests
        const trackPoints = [];

        // Process timestamps in chunks of 10
        for (let i = 0; i < timestamps.length; i += 10) {
          const chunk = timestamps.slice(i, i + 10);
          const timestampParam = chunk.join(",");

          const response = await fetch(
            `https://api.wheretheiss.at/v1/satellites/25544/positions?timestamps=${timestampParam}`
          );

          if (!response.ok) {
            throw new Error(
              `API request failed with status ${response.status}`
            );
          }

          const positions = await response.json();
          trackPoints.push(...positions);
        }

        // Convert the positions to the format needed for the Polyline
        const track = trackPoints.map((pos) => [pos.latitude, pos.longitude]);
        setGroundTrack(track);
      } catch (error) {
        console.error("Error fetching ISS ground track:", error);
      }
    };

    fetchISSPosition();
    const interval = setInterval(fetchISSPosition, 30000); // Update every 30 seconds

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
                <p>
                  <span>Ground Track:</span> Next 90 minutes
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
              {groundTrack.length > 0 && (
                <Polyline
                  positions={groundTrack}
                  color="#00FFFF"
                  weight={2}
                  opacity={0.7}
                  dashArray="5, 5"
                />
              )}
            </MapContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
