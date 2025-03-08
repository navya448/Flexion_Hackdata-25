import { useState, useEffect } from "react";

const API_URL = "http://127.0.0.1:5000/api/sensor-data"; // Flask API URL

export default function useDataFetcher(refreshRate) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching data..."); // Log fetch attempts
        const response = await fetch(API_URL, { cache: "no-store" }); // Ensure no caching issues
        if (!response.ok) throw new Error("Failed to fetch data");

        const jsonData = await response.json();
        console.log("Received data:", jsonData); // Log the fetched data

        setData(jsonData);
        setStatus("connected");
        setLastUpdate(new Date());
      } catch (err) {
        console.error("Error fetching data:", err);
        setStatus("disconnected");
        setError(err);
      }
    };

    fetchData(); // Fetch immediately
    const interval = setInterval(fetchData, refreshRate); // Auto refresh

    return () => clearInterval(interval); // Cleanup on unmount
  }, [refreshRate]);

  return { data, status, error, lastUpdate };
}
