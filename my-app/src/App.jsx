import { useState } from "react";
import useDataFetcher from "./DataFetcher";
import "./App.css";

function App() {
  const [refreshRate, setRefreshRate] = useState(1000);
  const { data, status, error, lastUpdate } = useDataFetcher(refreshRate);

  if (!data) return <p className="loading">Loading...</p>;

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Posture Monitor</h1>
        <div className="connection-status">
          <span className={`status-dot ${status}`}></span>
          {status.toUpperCase()} {lastUpdate && ` - Last update: ${lastUpdate.toLocaleTimeString()}`}
        </div>
      </header>

      {error && <p className="error">⚠️ Error: {error.message}</p>}

      <main className="app-main">
        <div className="content-wrapper">
          <section className="sensor-card">
            <h2>Posture Data</h2>
            <p>Posture Angle: {data.ax?.toFixed(2)}°</p>
            <p>Pitch: {data.ay?.toFixed(2)}°</p>
            <p>Roll: {data.az?.toFixed(2)}°</p>
          </section>

          <section className="sensor-card">
            <h2>Accelerometer</h2>
            <p>X: {data.gx?.toFixed(2)} m/s²</p>
            <p>Y: {data.gy?.toFixed(2)} m/s²</p>
            <p>Z: {data.gz?.toFixed(2)} m/s²</p>
          </section>

          <section className="sensor-card">
            <h2>Gyroscope</h2>
            <p>X: {data.pitchAngle?.toFixed(2)}°/s</p>
            <p>Y: {data.postureAngle?.toFixed(2)}°/s</p>
            <p>Z: {data.rollAngle?.toFixed(2)}°/s</p>
          </section>

          <section className="sensor-card">
            <h2>Temperature</h2>
            <p>{data.temperature?.toFixed(2)}°C</p>
          </section>

          <section className="settings-card">
            <h2>Settings</h2>
            <label>Refresh Rate: </label>
            <select value={refreshRate} onChange={(e) => setRefreshRate(Number(e.target.value))}>
              <option value={500}>0.5 sec</option>
              <option value={1000}>1 sec</option>
              <option value={2000}>2 sec</option>
            </select>
          </section>
        </div>
      </main>

      <footer className="app-footer">
        <p>&copy; 2025 Posture Monitor</p>
      </footer>
    </div>
  );
}

export default App;
