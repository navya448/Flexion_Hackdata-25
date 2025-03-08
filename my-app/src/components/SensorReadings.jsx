// components/SensorReadings.jsx - Updated to display all sensor data
const SensorReadings = ({ postureAngle, pitch, roll, accelerometer, gyroscope, temperature }) => {
    return (
      <div className="sensor-readings">
        <h2>Sensor Readings</h2>
        
        <div className="readings-section">
          <h3>Posture Metrics</h3>
          <div className="readings-container">
            <div className="reading">
              <div className="reading-label">Posture Angle</div>
              <div className="reading-value">{postureAngle}°</div>
            </div>
            <div className="reading">
              <div className="reading-label">Pitch</div>
              <div className="reading-value">{pitch}°</div>
            </div>
            <div className="reading">
              <div className="reading-label">Roll</div>
              <div className="reading-value">{roll}°</div>
            </div>
          </div>
        </div>
        
        <div className="readings-section">
          <h3>Accelerometer (m/s²)</h3>
          <div className="readings-container">
            <div className="reading">
              <div className="reading-label">X-Axis</div>
              <div className="reading-value">{accelerometer?.x?.toFixed(2) || '0.00'}</div>
            </div>
            <div className="reading">
              <div className="reading-label">Y-Axis</div>
              <div className="reading-value">{accelerometer?.y?.toFixed(2) || '0.00'}</div>
            </div>
            <div className="reading">
              <div className="reading-label">Z-Axis</div>
              <div className="reading-value">{accelerometer?.z?.toFixed(2) || '0.00'}</div>
            </div>
          </div>
        </div>
        
        <div className="readings-section">
          <h3>Gyroscope (°/s)</h3>
          <div className="readings-container">
            <div className="reading">
              <div className="reading-label">X-Axis</div>
              <div className="reading-value">{gyroscope?.x?.toFixed(2) || '0.00'}</div>
            </div>
            <div className="reading">
              <div className="reading-label">Y-Axis</div>
              <div className="reading-value">{gyroscope?.y?.toFixed(2) || '0.00'}</div>
            </div>
            <div className="reading">
              <div className="reading-label">Z-Axis</div>
              <div className="reading-value">{gyroscope?.z?.toFixed(2) || '0.00'}</div>
            </div>
          </div>
        </div>
        
        <div className="readings-section temp-section">
          <h3>Temperature</h3>
          <div className="reading temp-reading">
            <div className="reading-label">Sensor Temp</div>
            <div className="reading-value">{temperature?.toFixed(2) || '0.00'}°C</div>
          </div>
        </div>
      </div>
    );
  };
  
  export default SensorReadings;