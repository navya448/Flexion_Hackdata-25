export default function SensorReadings({ postureAngle, pitch, roll }) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Sensor Readings</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Posture Angle</span>
            <span className="text-lg font-medium">{postureAngle}°</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Pitch</span>
            <span className="text-lg font-medium">{pitch}°</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Roll</span>
            <span className="text-lg font-medium">{roll}°</span>
          </div>
        </div>
      </div>
    );
  }