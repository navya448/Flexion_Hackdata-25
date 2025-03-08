import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import useDataFetcher from "./DataFetcher";
import "./App.css";

function App() {
  const [refreshRate, setRefreshRate] = useState(1000);
  const { data, status, error, lastUpdate } = useDataFetcher(refreshRate);
  const [sensorHistory, setSensorHistory] = useState([]);

  useEffect(() => {
    if (data) {
      setSensorHistory((prev) => [
        ...prev.slice(-50), // Keep only the last 50 readings
        {
          time: new Date().toLocaleTimeString(),
          postureAngle: data.ax,
          pitch: data.ay,
          roll: data.az,
          accX: data.gx,
          accY: data.gy,
          accZ: data.gz,
          gyroX: data.pitchAngle,
          gyroY: data.postureAngle,
          gyroZ: data.rollAngle,
          temperature: data.temperature,
        },
      ]);
    }
  }, [data]);

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

      <main className="app-main">
        <div className="content-wrapper">
          {/* 📊 Graphs First */}
          <section className="chart-section">
            <h2>Posture Angle Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sensorHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="postureAngle" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </section>

          <section className="chart-section">
            <h2>Accelerometer Readings</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sensorHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="accX" stroke="#ff7300" />
                <Line type="monotone" dataKey="accY" stroke="#387908" />
                <Line type="monotone" dataKey="accZ" stroke="#0033cc" />
              </LineChart>
            </ResponsiveContainer>
          </section>

          <section className="chart-section">
            <h2>Gyroscope Readings</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sensorHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="gyroX" stroke="#d62728" />
                <Line type="monotone" dataKey="gyroY" stroke="#2ca02c" />
                <Line type="monotone" dataKey="gyroZ" stroke="#1f77b4" />
              </LineChart>
            </ResponsiveContainer>
          </section>

          <section className="chart-section">
            <h2>Temperature Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sensorHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="temperature" stroke="#ff0000" />
              </LineChart>
            </ResponsiveContainer>
          </section>

          {/* 📝 Stats After Graphs */}
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
