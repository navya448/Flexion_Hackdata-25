import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import useDataFetcher from "./DataFetcher";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  // General settings
  const [refreshRate, setRefreshRate] = useState(1000);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [mode, setMode] = useState("normal"); // normal or activity
  
  // Threshold settings
  const [postureThreshold, setPostureThreshold] = useState(75); // Default normal mode threshold
  const [rollThreshold, setRollThreshold] = useState(15); // Default normal mode threshold
  
  // Data handling
  const { data, status, error, lastUpdate } = useDataFetcher(isMonitoring ? refreshRate : null);
  const [sensorHistory, setSensorHistory] = useState([]);
  const [lastValidData, setLastValidData] = useState(null);
  
  // Activity detection
  const [isInActivity, setIsInActivity] = useState(false);
  const [activityTimer, setActivityTimer] = useState(null);
  const [movementBuffer, setMovementBuffer] = useState([]);
  const [calibrationMode, setCalibrationMode] = useState(false);
  const [userBaseline, setUserBaseline] = useState({
    postureAngle: 80, // Default values
    roll: 0,
    pitch: 0
  });
  
  // Bad posture duration tracking
  const [badPostureDuration, setBadPostureDuration] = useState(0);
  const [badPostureTimer, setBadPostureTimer] = useState(null);

  useEffect(() => {
    if (data && isMonitoring) {
      // Update the last valid data whenever we receive new data
      setLastValidData(data);
      
      // Use a timestamp as identifier to ensure proper ordering
      const timestamp = Date.now();
      const timeString = new Date().toLocaleTimeString();
      
      // Create new entry for history
      const newEntry = {
        id: timestamp,
        time: timeString,
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
      };
      
      // Update sensor history
      setSensorHistory((prev) => {
        const updatedHistory = [...prev, newEntry].slice(-50);
        return updatedHistory.sort((a, b) => a.id - b.id);
      });

      // Update movement buffer for activity detection
      setMovementBuffer(prev => {
        const updatedBuffer = [...prev, {
          timestamp,
          postureAngle: data.postureAngle,
          roll: data.rollAngle,
          pitch: data.pitchAngle,
          accX: data.gx,
          accY: data.gy,
          accZ: data.gz
        }].slice(-10); // Keep last 10 readings for pattern detection
        return updatedBuffer;
      });

      // Detect intentional movement vs. bad posture
      detectActivityOrBadPosture(data);
    }
  }, [data, isMonitoring, postureThreshold, rollThreshold, mode, refreshRate]);

  // Function to detect if current movement is an activity or bad posture
  const detectActivityOrBadPosture = (currentData) => {
    // Skip checks if we're calibrating
    if (calibrationMode) return;
    
    // Calculate movement metrics
    const accelerationMagnitude = Math.sqrt(
      Math.pow(currentData.gx, 2) + 
      Math.pow(currentData.gy, 2) + 
      Math.pow(currentData.gz, 2)
    );
    
    // Detect sudden acceleration changes (picking up items, exercise movements)
    const activitySensitivity = window.activitySensitivity || 1.8;
    const isHighAcceleration = accelerationMagnitude > activitySensitivity;
    
    // Check if the posture data indicates bad posture
    const isPoorPosture = currentData.postureAngle < postureThreshold || 
                          (180 - Math.abs(currentData.rollAngle)) > rollThreshold;
    
    // If we detect high acceleration, we're likely in an activity
    if (isHighAcceleration && !isInActivity) {
      setIsInActivity(true);
      // Set a timer to exit activity mode after some seconds of normal movement
      if (activityTimer) clearTimeout(activityTimer);
      const timeoutDuration = window.activityTimeout || 5000;
      const timer = setTimeout(() => {
        setIsInActivity(false);
      }, timeoutDuration);
      setActivityTimer(timer);
      
      // Toast only when entering activity mode
      toast.info("Activity detected - posture warnings paused", {
        position: "top-right",
        autoClose: 2000,
      });
    }
    
    // Track bad posture duration in all modes
    if (isPoorPosture) {
      // If this is the start of bad posture, begin the timer
      if (badPostureDuration === 0) {
        if (badPostureTimer) clearTimeout(badPostureTimer);
        const timer = setTimeout(() => {
          // After 5 seconds of continuous bad posture, show the warning
          if (mode === "normal" || (mode === "activity" && !isInActivity)) {
            toast.error("Bad Posture Detected! Please adjust your posture.", {
              position: "top-right",
              autoClose: 3000,
            });
          } else if (mode === "activity" && isInActivity) {
            toast.error("Bad posture for too long! Adjust even during activity.", {
              position: "top-right",
              autoClose: 3000,
            });
          }
        }, 5000); // 5 seconds threshold
        setBadPostureTimer(timer);
      }
      // Increment the duration counter
      setBadPostureDuration(prev => prev + refreshRate/1000);
    } else {
      // Reset the duration if posture is good
      setBadPostureDuration(0);
      if (badPostureTimer) {
        clearTimeout(badPostureTimer);
        setBadPostureTimer(null);
      }
    }
    
    // For immediate feedback in normal mode
    if (isPoorPosture && !isInActivity && mode === "normal") {
      // Pattern detection to check if this is just returning to position
      const isReturningToPosition = detectReturningPattern();
      
      if (!isReturningToPosition) {
        toast.error("Bad Posture Detected! Please adjust your posture.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };
  
  // Function to detect if user is just returning to position after bending
  const detectReturningPattern = () => {
    if (movementBuffer.length < 5) return false;
    
    // Look at postureAngle trend over last few readings
    const lastFewReadings = movementBuffer.slice(-5);
    
    // If angles are consistently improving, user is likely returning to good posture
    let improving = true;
    for (let i = 1; i < lastFewReadings.length; i++) {
      if (lastFewReadings[i].postureAngle <= lastFewReadings[i-1].postureAngle) {
        improving = false;
        break;
      }
    }
    
    return improving;
  };

  // Start calibration mode to set user's baseline posture
  const startCalibration = () => {
    setCalibrationMode(true);
    toast.info("Calibration started. Please sit with good posture for 5 seconds.", {
      position: "top-center",
      autoClose: 5000,
    });
    
    // Collect data for 5 seconds
    setTimeout(() => {
      if (sensorHistory.length > 0) {
        // Calculate average from last few readings
        const lastReadings = sensorHistory.slice(-5);
        const avgPostureAngle = lastReadings.reduce((sum, reading) => sum + reading.postureAngle, 0) / lastReadings.length;
        const avgRoll = lastReadings.reduce((sum, reading) => sum + reading.roll, 0) / lastReadings.length;
        const avgPitch = lastReadings.reduce((sum, reading) => sum + reading.pitch, 0) / lastReadings.length;
        
        setUserBaseline({
          postureAngle: avgPostureAngle,
          roll: avgRoll,
          pitch: avgPitch
        });
        
        toast.success("Calibration complete! Your baseline posture has been saved.", {
          position: "top-center",
          autoClose: 3000,
        });
      }
      setCalibrationMode(false);
    }, 5000);
  };

  // Toggle function for monitoring
  const toggleMonitoring = () => {
    setIsMonitoring(prev => !prev);
    if (!isMonitoring) {
      toast.info("Monitoring resumed", { position: "top-right", autoClose: 2000 });
    } else {
      toast.warn("Monitoring paused", { position: "top-right", autoClose: 2000 });
    }
  };

  // Switch between modes
  const toggleMode = () => {
    // Toggle between normal and activity mode only
    if (mode === "normal") {
      setMode("activity");
      setPostureThreshold(50); // Much more lenient for activity
      setRollThreshold(30); // Much more lenient for activity
      toast.info("Switched to Activity Mode (for workouts/movement)", { position: "top-right", autoClose: 2000 });
    } else {
      setMode("normal");
      setPostureThreshold(75);
      setRollThreshold(15);
      toast.info("Switched to Normal Mode", { position: "top-right", autoClose: 2000 });
    }
  };

  // Determine which data to display (current data when monitoring, last valid data when paused)
  const displayData = isMonitoring ? data : lastValidData;

  if (!displayData) return <p className="loading">Loading...</p>;

  return (
    <div className={`app-container ${mode}-mode`}>
      <ToastContainer />
      <header className="app-header">
        <h1>
          Posture Monitor 
          {mode === "activity" ? "- Activity Mode" : ""}
          {isInActivity && " (Activity Detected)"}
          {calibrationMode && " (Calibrating)"}
        </h1>
        <div className="connection-status">
          <span className={`status-dot ${isMonitoring ? status : "paused"}`}></span>
          {isMonitoring ? status.toUpperCase() : "PAUSED"} 
          {lastUpdate && ` - Last update: ${isMonitoring ? lastUpdate.toLocaleTimeString() : "Monitoring paused"}`}
        </div>
      </header>
      
      {/* Mode toggle buttons */}
      <div className="mode-toggle-container">
        <button 
          onClick={toggleMode}
          className={`mode-toggle-button ${mode}`}
        >
          {mode === "normal" ? "Switch to Activity Mode" : "Switch to Normal Mode"}
        </button>
        
        {/* Calibration button */}
        <button
          onClick={startCalibration}
          className="calibrate-button"
          disabled={calibrationMode || !isMonitoring}
        >
          {calibrationMode ? "Calibrating..." : "Calibrate to Your Posture"}
        </button>
      </div>

      {/* Content card - different for each mode */}
      <section className="content-card">
        {mode === "normal" ? (
          <>
            <h2>The Importance of Good Posture</h2>
            <p>
              Good posture is essential for overall health and well-being. It helps prevent back pain, reduces strain on muscles and joints, and improves circulation. Poor posture, on the other hand, can lead to chronic pain, fatigue, and even long-term spinal issues.
            </p>
          </>
        ) : (
          <>
            <h2>Activity Mode</h2>
            <p>
              This mode is designed for active periods when you're moving around, exercising, or frequently changing position. The system will automatically detect movements and temporarily pause immediate posture warnings during activities. However, if poor posture persists for more than 5 seconds, you'll still get an alert.
            </p>
          </>
        )}
      </section>
      <br></br>
      <main className="app-main">
        <div className="content-wrapper">
          {/* Four chart sections in a 2x2 grid at the top */}
          <section className="chart-section">
            <h2>Posture Angle Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sensorHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" tickCount={5} />
                <YAxis domain={['auto', 'auto']} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="postureAngle" 
                  stroke={mode === "activity" ? "#00ff00" : "#8884d8"} 
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </section>

          <section className="chart-section">
            <h2>Accelerometer Readings</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sensorHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" tickCount={5} />
                <YAxis domain={['auto', 'auto']} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="accX" stroke="#ff7300" dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="accY" stroke="#387908" dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="accZ" stroke="#0033cc" dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </section>

          <section className="chart-section">
            <h2>Gyroscope Readings</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sensorHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" tickCount={5} />
                <YAxis domain={['auto', 'auto']} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="gyroX" stroke="#d62728" dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="gyroY" stroke="#2ca02c" dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="gyroZ" stroke="#1f77b4" dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </section>

          <section className="chart-section">
            <h2>Movement Intensity</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sensorHistory.map(entry => ({
                ...entry,
                // Calculate combined acceleration (movement intensity)
                movementIntensity: Math.sqrt(
                  Math.pow(entry.accX || 0, 2) + 
                  Math.pow(entry.accY || 0, 2) + 
                  Math.pow(entry.accZ || 0, 2)
                ).toFixed(2)
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" tickCount={5} />
                <YAxis domain={[0, 'auto']} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="movementIntensity" 
                  stroke="#ff0000" 
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </section>

          {/* Sensor card and settings card side by side in the bottom row */}
          <section className="sensor-card">
            <h2>Posture Data {!isMonitoring && <span>(Paused)</span>}</h2>
            <p>Posture Angle: {displayData.ax?.toFixed(2)}°</p>
            <p>Pitch: {displayData.ay?.toFixed(2)}°</p>
            <p>Roll: {displayData.az?.toFixed(2)}°</p>
            
            {/* Activity status */}
            <div className="activity-status">
              <h3>Status</h3>
              <p className={isInActivity ? "active" : ""}>
                {isInActivity ? "Movement Detected - Immediate Alerts Paused" : "Monitoring Posture"}
              </p>
              {mode === "activity" && <p>Activity mode - more movement allowed</p>}
              {badPostureDuration > 0 && (
                <p className="bad-posture-duration">
                  Bad posture duration: {badPostureDuration.toFixed(1)}s
                  {badPostureDuration >= 5 && <span className="warning"> ⚠️ Too long!</span>}
                </p>
              )}
              
              {/* Show user baseline after calibration */}
              {!calibrationMode && (
                <div className="baseline-info">
                  <h4>Your Calibrated Baseline</h4>
                  <p>Ideal Posture: {userBaseline.postureAngle.toFixed(1)}°</p>
                </div>
              )}
            </div>
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
            
            <div className="setting-row">
              <button 
                onClick={toggleMonitoring}
                className={`toggle-button ${isMonitoring ? 'on' : 'off'}`}
              >
                {isMonitoring ? 'TURN OFF' : 'TURN ON'}
              </button>
            </div>

            {/* Mode-specific settings */}
            <div className="custom-settings">
              <h3>Posture Thresholds</h3>
              <div className="threshold-setting">
                <label>Posture Angle Threshold: </label>
                <input 
                  type="range" 
                  min={mode === "activity" ? "30" : "45"} 
                  max="90" 
                  value={postureThreshold} 
                  onChange={(e) => setPostureThreshold(Number(e.target.value))}
                  disabled={!isMonitoring}
                />
                <span>{postureThreshold}°</span>
              </div>
              <div className="threshold-setting">
                <label>Roll Angle Threshold: </label>
                <input 
                  type="range" 
                  min="5" 
                  max={mode === "activity" ? "45" : "25"} 
                  value={rollThreshold} 
                  onChange={(e) => setRollThreshold(Number(e.target.value))}
                  disabled={!isMonitoring}
                />
                <span>{rollThreshold}°</span>
              </div>
              <p className="threshold-info">
                Lower thresholds = stricter posture requirements
              </p>
            </div>
            
            {/* Advanced settings */}
            <div className="advanced-settings">
              <details>
                <summary>Advanced Settings</summary>
                <div className="advanced-setting-row">
                  <label>Activity Detection Sensitivity: </label>
                  <input 
                    type="range" 
                    min="1" 
                    max="3" 
                    step="0.1"
                    defaultValue="1.8" 
                    onChange={(e) => window.activitySensitivity = Number(e.target.value)}
                  />
                  <span>Lower = more sensitive</span>
                </div>
                <div className="advanced-setting-row">
                  <label>Activity Timeout (seconds): </label>
                  <input 
                    type="number" 
                    min="1" 
                    max="15"
                    defaultValue="5" 
                    onChange={(e) => window.activityTimeout = Number(e.target.value) * 1000}
                  />
                </div>
                <div className="advanced-setting-row">
                  <label>Bad Posture Alert Delay (seconds): </label>
                  <input 
                    type="number" 
                    min="1" 
                    max="10"
                    defaultValue="5" 
                    disabled={true}
                  />
                  <span>Time before showing bad posture alert in activity mode</span>
                </div>
              </details>
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