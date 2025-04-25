# Posture Monitor

> An intelligent posture tracking system that adapts to your activities and helps maintain proper posture

## 📋 Overview

Posture Monitor is a sophisticated real-time tracking system that helps users maintain proper posture during both stationary work and physical activities. Using advanced motion sensing and machine learning techniques, the application distinguishes between intentional movements and poor posture, providing timely feedback when corrections are needed.

## ✨ Key Features

- **Dual-Mode Operation**:
  - **Normal Mode**: Strict posture monitoring for desk work
  - **Activity Mode**: Flexible monitoring during physical activity with intelligent movement detection

- **Smart Detection System**:
  - Automatically identifies activities vs. poor posture
  - Prevents unnecessary alerts during intentional movements
  - Tracks prolonged poor posture duration

- **Personalized Calibration**:
  - Adapts to your ideal posture baseline
  - Customizable sensitivity thresholds

- **Comprehensive Data Visualization**:
  - Real-time posture angle tracking
  - Accelerometer and gyroscope readings
  - Movement intensity monitoring
  - Historical trend analysis

## 🖥️ Technical Details

### Built With
- React.js frontend
- Recharts for data visualization
- React-toastify for notifications
- Sensor integration (acceleration, gyroscope, and orientation data)

### Key Algorithms
- Acceleration magnitude calculation for activity detection
- Pattern recognition for returning-to-position movements
- Posture angle threshold monitoring
- Calibration averaging for personalized baselines

## 🚀 Getting Started

### Prerequisites
- Node.js (v14.0.0 or later)
- Compatible sensor hardware
- Modern web browser

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/posture-monitor.git
   cd posture-monitor
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure your sensor connection in `src/DataFetcher.js`

4. Start the development server:
   ```bash
   npm start
   ```

## 📊 Dashboard Overview

The dashboard is divided into several key sections:

### Data Visualization
- **Posture Angle Chart**: Tracks your posture angle over time
- **Accelerometer Readings**: Shows raw acceleration data on all axes
- **Gyroscope Readings**: Displays rotation information
- **Movement Intensity**: Aggregate measure of overall physical activity

### Control Panel
- Mode switching between Normal and Activity modes
- Calibration controls for personalized posture settings
- Refresh rate settings
- Monitoring toggle
- Threshold adjustments for posture and roll angles

### Advanced Settings
- Activity detection sensitivity
- Activity timeout duration
- Alert delay configuration

## 🔧 Usage Tips

### Calibration
For optimal results, calibrate the system while maintaining your ideal posture:

1. Sit or stand with proper posture
2. Click "Calibrate to Your Posture"
3. Hold the position for 5 seconds

### Activity Mode
Switch to Activity Mode when:
- Performing exercises
- Moving around frequently
- Working on tasks requiring bending or reaching

### Threshold Adjustments
- Lower thresholds create stricter posture requirements
- In Activity Mode, thresholds are automatically adjusted to be more lenient

## 📱 Mobile Integration

The responsive design ensures the application works seamlessly across devices:

- Desktop monitoring for workplace use
- Tablet/mobile support for on-the-go tracking
- Real-time synchronization between devices

## 🔍 How It Works

1. **Sensor Data Collection**: Continuously gathers motion and orientation data
2. **Analysis Algorithm**: Processes data to determine posture quality and activity state
3. **Smart Filtering**: Distinguishes between intentional movements and poor posture
4. **Feedback System**: Provides alerts only when necessary, avoiding disruption during activities
5. **Pattern Learning**: Improves detection accuracy over time by analyzing movement patterns

## 🔄 Future Enhancements

- Machine learning integration for improved activity recognition
- Long-term posture trend analytics
- Integration with fitness and health tracking platforms
- Customizable alert sounds and vibration patterns
- Cloud synchronization for multi-device usage

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Contact & Support

- Developer: Navya (https://github.com/navya448)
- Report Issues: [Issue Tracker](https://github.com/navya448/posture-monitor/issues)
