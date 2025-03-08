import requests
import time
import re

ESP_URL = "http://192.168.4.1/"  # Change this if needed
REFRESH_RATE = 1  # Seconds

def parse_sensor_data(raw_text):
    """Parses sensor data from ESP8266's raw text response."""
    data = {
        "accelerometer": {"x": 0, "y": 0, "z": 0},
        "gyroscope": {"x": 0, "y": 0, "z": 0},
        "temperature": 0,
        "posture_angle": 0,
        "pitch_angle": 0,
        "roll_angle": 0
    }

    try:
        # Extract accelerometer data
        accel_match = re.search(r"Accelerometer.*X=([-\d.]+), Y=([-\d.]+), Z=([-\d.]+)", raw_text)
        if accel_match:
            data["accelerometer"] = {
                "x": float(accel_match.group(1)),
                "y": float(accel_match.group(2)),
                "z": float(accel_match.group(3)),
            }

        # Extract gyroscope data
        gyro_match = re.search(r"Gyroscope.*X=([-\d.]+), Y=([-\d.]+), Z=([-\d.]+)", raw_text)
        if gyro_match:
            data["gyroscope"] = {
                "x": float(gyro_match.group(1)),
                "y": float(gyro_match.group(2)),
                "z": float(gyro_match.group(3)),
            }

        # Extract temperature
        temp_match = re.search(r"Temperature.*:\s*([-\d.]+)", raw_text)
        if temp_match:
            data["temperature"] = float(temp_match.group(1))

        # Extract angles
        posture_match = re.search(r"Posture Angle.*:\s*([-\d.]+)", raw_text)
        if posture_match:
            data["posture_angle"] = float(posture_match.group(1))

        pitch_match = re.search(r"Pitch Angle.*:\s*([-\d.]+)", raw_text)
        if pitch_match:
            data["pitch_angle"] = float(pitch_match.group(1))

        roll_match = re.search(r"Roll Angle.*:\s*([-\d.]+)", raw_text)
        if roll_match:
            data["roll_angle"] = float(roll_match.group(1))

    except Exception as e:
        print(f"Error parsing data: {e}")

    return data

def fetch_data():
    """Fetches and processes data from the ESP8266."""
    try:
        response = requests.get(ESP_URL, timeout=5)  # Timeout to prevent hanging
        response.raise_for_status()  # Raise error for bad response
        raw_text = response.text.strip()
        return parse_sensor_data(raw_text)

    except requests.exceptions.RequestException as e:
        print(f"⚠️ Error fetching data: {e}")
        return None

if __name__ == "__main__":
    while True:
        sensor_data = fetch_data()
        if sensor_data:
            print("\nSensor Data:")
            print(sensor_data)
        time.sleep(REFRESH_RATE)
