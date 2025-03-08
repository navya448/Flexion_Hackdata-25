export default function PostureGauge({ postureAngle, threshold }) {
  const percentage = Math.min(Math.abs(postureAngle) / threshold * 100, 100);
  const isGood = percentage <= 75;
  const isWarning = percentage > 75 && percentage <= 90;
  
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Posture Gauge</h2>
      <div className="relative h-48 flex items-center justify-center">
        <div className="absolute w-40 h-40 rounded-full border-8 border-gray-100" />
        <div 
          className={`absolute w-40 h-40 rounded-full border-8 border-transparent border-t-8 transition-all duration-500 ${
            isGood ? 'border-t-green-500' : 
            isWarning ? 'border-t-yellow-500' : 
            'border-t-red-500'
          }`}
          style={{ 
            transform: `rotate(${postureAngle}deg)`
          }}
        />
        <div className="text-center">
          <span className="text-4xl font-bold text-gray-800">{Math.abs(postureAngle)}°</span>
          <p className="text-sm text-gray-500 mt-1">Current Angle</p>
        </div>
      </div>
    </div>
  );
}