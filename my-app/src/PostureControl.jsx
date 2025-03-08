import React, { useState, useEffect } from "react";

const PostureControl = () => {
  const [data, setData] = useState(null);
  const [postureMessage, setPostureMessage] = useState("Fetching data...");

  const fetchSensorData = async () => {
    try {
      const response = await fetch("http://192.168.4.1/");
      const text = await response.text();

      // Parse raw sensor data (assuming ESP8266 sends plain text)
      const parsedData = parseSensorData(text);
      setData(parsedData);

      // Check posture based on angles
      checkPosture(parsedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setPostureMessage("⚠️ Failed to connect to ESP8266.");
    }
  };

  const parseSensorData = (rawText) => {
    const lines = rawText.split("\n");
    const dataObj = {};

    lines.forEach((line) => {
      const match = line.match(/(.*?):\s*([-\d.]+)/);
      if (match) {
        dataObj[match[1].trim()] = parseFloat(match[2]);
      }
    });

    return {
      accelerometer: { x: dataObj["Accelerometer (m/s²) X"], y: dataObj["Y"], z: dataObj["Z"] },
      gyroscope: { x: dataObj["Gyroscope (°/s) X"], y: dataObj["Y"], z: dataObj["Z"] },
      temperature: dataObj["Temperature (°C)"],
      postureAngle: dataObj["Posture Angle (°) [Z-axis mapping]"],
      pitchAngle: dataObj["Pitch Angle (°)"],
      rollAngle: dataObj["Roll Angle (°)"],
    };
  };

  const checkPosture = (sensorData) => {
    if (!sensorData) return;

    const { postureAngle, pitchAngle, rollAngle } = sensorData;
    const tiltThreshold = 15;

    if (Math.abs(postureAngle) > tiltThreshold || Math.abs(pitchAngle) > 70 || Math.abs(rollAngle) > 120) {
      setPostureMessage("⚠️ Bad Posture Detected! Sit straight.");
    } else {
      setPostureMessage("✅ Good Posture!");
    }
  };

  useEffect(() => {
    fetchSensorData();
    const interval = setInterval(fetchSensorData, 2000); // Fetch every 2 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg text-center">
      <h1 className="text-2xl font-bold mb-4">Posture Control System</h1>
      <p className="text-lg font-semibold">{postureMessage}</p>

      {data ? (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md">
          <p>🌡 Temperature: {data.temperature}°C</p>
          <p>🦴 Posture Angle: {data.postureAngle}°</p>
          <p>🎯 Pitch Angle: {data.pitchAngle}°</p>
          <p>↩️ Roll Angle: {data.rollAngle}°</p>
        </div>
      ) : (
        <p>Loading sensor data...</p>
      )}
    </div>
  );
};

export default PostureControl;
