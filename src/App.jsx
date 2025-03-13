import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [issPosition, setIssPosition] = useState({ latitude: 0, longitude: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchISSPosition = async () => {
      try {
        const response = await fetch("http://api.open-notify.org/iss-now.json");
        const data = await response.json();
        setIssPosition({
          latitude: parseFloat(data.iss_position.latitude).toFixed(4),
          longitude: parseFloat(data.iss_position.longitude).toFixed(4),
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
        <div className="position-container">
          <div className="position-card">
            <h2>Current Position</h2>
            <div className="coordinates">
              <p>
                <span>Latitude:</span> {issPosition.latitude}°
              </p>
              <p>
                <span>Longitude:</span> {issPosition.longitude}°
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
