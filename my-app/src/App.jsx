// App.jsx - Main Application Component (Updated for text format)
import { useState, useEffect, useCallback } from 'react';
import './App.css';
import PostureGauge from './components/PostureGauge';
import SensorReadings from './components/SensorReadings';
import AlertSystem from './components/AlertSystem';
import StatusIndicator from './components/StatusIndicator';

function App() {
  const [sensorData, setSensorData] = useState({
    accelerometer: { x: 0, y: 0, z: 0 },
    gyroscope: { x: 0, y: 0, z: 0 },
    temperature: 0,
    postureAngle: 0,
    pitch: 0,
    roll: 0,
    timestamp: Date.now()
  });
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [refreshRate, setRefreshRate] = useState(1000); // 1 second default
  const [alerts, setAlerts] = useState([]);
  const [thresholds, setThresholds] = useState({
    postureAngle: 15, // degrees
    pitch: 20, // degrees
    roll: 20, // degrees
  });

  // Parse text data from ESP8266
  const parseTextData = (text) => {
    try {
      // Create an object to store the extracted values
      const data = {
        accelerometer: { x: 0, y: 0, z: 0 },
        gyroscope: { x: 0, y: 0, z: 0 },
        temperature: 0,
        postureAngle: 0,
        pitch: 0,
        roll: 0
      };
      
      // Extract accelerometer data
      const accelMatch = text.match(/Accelerometer \(m\/s.+\): X=([-\d.]+), Y=([-\d.]+), Z=([-\d.]+)/);
      if (accelMatch) {
        data.accelerometer = {
          x: parseFloat(accelMatch[1]),
          y: parseFloat(accelMatch[2]),
          z: parseFloat(accelMatch[3])
        };
      }
      
      // Extract gyroscope data
      const gyroMatch = text.match(/Gyroscope \(.+\): X=([-\d.]+), Y=([-\d.]+), Z=([-\d.]+)/);
      if (gyroMatch) {
        data.gyroscope = {
          x: parseFloat(gyroMatch[1]),
          y: parseFloat(gyroMatch[2]),
          z: parseFloat(gyroMatch[3])
        };
      }
      
      // Extract temperature
      const tempMatch = text.match(/Temperature \(.+\): ([-\d.]+)/);
      if (tempMatch) {
        data.temperature = parseFloat(tempMatch[1]);
      }
      
      // Extract posture angle
      const postureMatch = text.match(/Posture Angle \(.+\): ([-\d.]+)/);
      if (postureMatch) {
        data.postureAngle = parseFloat(postureMatch[1]);
      }
      
      // Extract pitch angle
      const pitchMatch = text.match(/Pitch Angle \(.+\): ([-\d.]+)/);
      if (pitchMatch) {
        data.pitch = parseFloat(pitchMatch[1]);
      }
      
      // Extract roll angle
      const rollMatch = text.match(/Roll Angle \(.+\): ([-\d.]+)/);
      if (rollMatch) {
        data.roll = parseFloat(rollMatch[1]);
      }
      
      return data;
    } catch (error) {
      console.error('Error parsing sensor data:', error);
      return null;
    }
  };

  // Fetch sensor data from ESP8266
  const fetchSensorData = useCallback(async () => {
    try {
      setConnectionStatus('connecting');
      const response = await fetch('/api');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      // Get the text response instead of JSON
      const textData = await response.text();
      const parsedData = parseTextData(textData);
      
      if (!parsedData) {
        throw new Error('Failed to parse sensor data');
      }
      
      const newData = {
        ...parsedData,
        postureAngle: parseFloat(parsedData.postureAngle).toFixed(2),
        pitch: parseFloat(parsedData.pitch).toFixed(2),
        roll: parseFloat(parsedData.roll).toFixed(2),
        timestamp: Date.now()
      };
      
      setSensorData(newData);
      setConnectionStatus('connected');
      
      // Check for alerts
      checkAlerts(newData);
      
    } catch (error) {
      console.error('Error fetching sensor data:', error);
      setConnectionStatus('error');
      
      // Add connection error alert
      if (alerts.length === 0 || alerts[0].type !== 'connection') {
        setAlerts(prev => [{
          id: Date.now(),
          type: 'connection',
          message: 'Connection to sensor lost. Check your WiFi connection.',
          timestamp: Date.now()
        }, ...prev.slice(0, 4)]);
      }
    }
  }, [alerts]);

  // Check sensor data against thresholds and generate alerts
  const checkAlerts = (data) => {
    const newAlerts = [];
    
    if (parseFloat(data.postureAngle) > thresholds.postureAngle) {
      newAlerts.push({
        id: Date.now(),
        type: 'posture',
        message: `Poor posture detected! Angle: ${data.postureAngle}° - Please sit up straight.`,
        timestamp: Date.now()
      });
    }
    
    if (Math.abs(parseFloat(data.pitch)) > thresholds.pitch) {
      newAlerts.push({
        id: Date.now(),
        type: 'pitch',
        message: `Excessive forward/backward tilt detected: ${data.pitch}°`,
        timestamp: Date.now()
      });
    }
    
    if (Math.abs(parseFloat(data.roll)) > thresholds.roll) {
      newAlerts.push({
        id: Date.now(),
        type: 'roll',
        message: `Excessive side tilt detected: ${data.roll}°`,
        timestamp: Date.now()
      });
    }
    
    if (newAlerts.length > 0) {
      setAlerts(prev => [...newAlerts, ...prev].slice(0, 5));
    }
  };

  // Setup automatic refresh
  useEffect(() => {
    const intervalId = setInterval(fetchSensorData, refreshRate);
    
    // Fetch immediately on component mount
    fetchSensorData();
    
    return () => clearInterval(intervalId);
  }, [fetchSensorData, refreshRate]);

  // Handle refresh rate change
  const handleRefreshRateChange = (e) => {
    const rate = parseInt(e.target.value);
    setRefreshRate(rate);
  };

  // Handle threshold change
  const handleThresholdChange = (type, value) => {
    setThresholds(prev => ({
      ...prev,
      [type]: parseFloat(value)
    }));
  };

  return (
    <div className="app-container">
      <header>
        <h1>Posture Monitor</h1>
        <StatusIndicator status={connectionStatus} lastUpdate={sensorData.timestamp} />
      </header>

      <main>
        <section className="sensor-section">
          <PostureGauge 
            postureAngle={parseFloat(sensorData.postureAngle)} 
            threshold={thresholds.postureAngle} 
          />
          <SensorReadings 
            postureAngle={sensorData.postureAngle}
            pitch={sensorData.pitch}
            roll={sensorData.roll}
            accelerometer={sensorData.accelerometer}
            gyroscope={sensorData.gyroscope}
            temperature={sensorData.temperature}
          />
        </section>
          
        <section className="alert-section">
          <h2>Alerts & Notifications</h2>
          <AlertSystem alerts={alerts} />
        </section>
          
        <section className="settings-section">
          <h2>Settings</h2>
          <div className="settings-group">
            <label>
              Refresh Rate:
              <select value={refreshRate} onChange={handleRefreshRateChange}>
                <option value={500}>0.5 seconds</option>
                <option value={1000}>1 second</option>
                <option value={2000}>2 seconds</option>
                <option value={5000}>5 seconds</option>
              </select>
            </label>
          </div>
            
          <div className="settings-group">
            <h3>Alert Thresholds</h3>
            <label>
              Posture Angle (°):
              <input 
                type="number" 
                value={thresholds.postureAngle}
                onChange={(e) => handleThresholdChange('postureAngle', e.target.value)}
                min="1"
                max="45"
              />
            </label>
              
            <label>
              Pitch (°):
              <input 
                type="number" 
                value={thresholds.pitch}
                onChange={(e) => handleThresholdChange('pitch', e.target.value)}
                min="1"
                max="90"
              />
            </label>
              
            <label>
              Roll (°):
              <input 
                type="number" 
                value={thresholds.roll}
                onChange={(e) => handleThresholdChange('roll', e.target.value)}
                min="1"
                max="90"
              />
            </label>
          </div>
        </section>
      </main>
          
      <footer>
        <p>Real-time Posture Monitoring System • Hackathon Project • {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;