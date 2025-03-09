import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import useDataFetcher from "./DataFetcher";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const [refreshRate, setRefreshRate] = useState(1000);
  const [isMonitoring, setIsMonitoring] = useState(true); // State for monitoring toggle
  const { data, status, error, lastUpdate } = useDataFetcher(isMonitoring ? refreshRate : null); // Pass null to pause data fetching
  const [sensorHistory, setSensorHistory] = useState([]);
  const [lastValidData, setLastValidData] = useState(null); // Store the last valid data

  useEffect(() => {
    if (data && isMonitoring) {
      // Update the last valid data whenever we receive new data
      setLastValidData(data);
      
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

      if (data.postureAngle < 75 || (180-Math.abs(data.rollAngle))>15) {
        toast.error("Bad Posture Detected! Please adjust your posture.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  }, [data, isMonitoring]);

  // Toggle function for monitoring
  const toggleMonitoring = () => {
    setIsMonitoring(prev => !prev);
    if (!isMonitoring) {
      toast.info("Monitoring resumed", { position: "top-right", autoClose: 2000 });
    } else {
      toast.warn("Monitoring paused", { position: "top-right", autoClose: 2000 });
    }
  };

  // Determine which data to display (current data when monitoring, last valid data when paused)
  const displayData = isMonitoring ? data : lastValidData;

  if (!displayData) return <p className="loading">Loading...</p>;

  return (
    <div className="app-container">
      <ToastContainer />
      <header className="app-header">
        <h1>Posture Monitor</h1>
        <div className="connection-status">
          <span className={`status-dot ${isMonitoring ? status : "paused"}`}></span>
          {isMonitoring ? status.toUpperCase() : "PAUSED"} 
          {lastUpdate && ` - Last update: ${isMonitoring ? lastUpdate.toLocaleTimeString() : "Monitoring paused"}`}
        </div>
      </header>
      {/* ✨ New Content Section ✨ */}
      <section className="content-card">
        <h2>The Importance of Good Posture</h2>
        <p>
          Good posture is essential for overall health and well-being. It helps prevent back pain, reduces strain on muscles and joints, and improves circulation. Poor posture, on the other hand, can lead to chronic pain, fatigue, and even long-term spinal issues.
        </p>
      </section>
      <br></br>
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

          <section className="sensor-card">
            <h2>Posture Data {!isMonitoring && <span>(Paused)</span>}</h2>
            <p>Posture Angle: {displayData.ax?.toFixed(2)}°</p>
            <p>Pitch: {displayData.ay?.toFixed(2)}°</p>
            <p>Roll: {displayData.az?.toFixed(2)}°</p>
          </section>

          <section className="settings-card">
            <h2>Settings</h2>
            <div className="setting-row">
              <label>Refresh Rate: </label>
              <select 
                value={refreshRate} 
                onChange={(e) => setRefreshRate(Number(e.target.value))}
                disabled={!isMonitoring}
              >
                <option value={500}>0.5 sec</option>
                <option value={1000}>1 sec</option>
                <option value={2000}>2 sec</option>
              </select>
            </div>
            
            <div className="setting-row" style={{ marginTop: "15px" }}>
              <button 
                onClick={toggleMonitoring}
                className={`toggle-button ${isMonitoring ? 'on' : 'off'}`}
              >
                {isMonitoring ? 'TURN OFF' : 'TURN ON'}
              </button>
            </div>
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