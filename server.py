from flask import Flask, jsonify
import requests
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

ESP_URL = "http://192.168.4.1/data"

def fetch_data():
    """Fetches sensor data from ESP8266."""
    try:
        response = requests.get(ESP_URL, timeout=5)
        response.raise_for_status()
        return response.json()  # Return JSON data
    except requests.exceptions.RequestException as e:
        print(f"⚠️ Error fetching data: {e}")
        return None

@app.route("/api/sensor-data", methods=["GET"])
def get_sensor_data():
    """API endpoint to fetch sensor data."""
    sensor_data = fetch_data()
    if sensor_data:
        return jsonify(sensor_data)
    else:
        return jsonify({"error": "Failed to fetch data"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
