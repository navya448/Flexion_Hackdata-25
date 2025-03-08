import { AlertTriangle, WifiOff } from 'lucide-react';

export default function AlertSystem({ alerts }) {
  return (
    <div className="space-y-3">
      {alerts.map(alert => (
        <div 
          key={alert.id}
          className={`flex items-start gap-3 p-4 rounded-lg ${
            alert.type === 'connection' ? 'bg-red-50' :
            alert.type === 'posture' ? 'bg-yellow-50' :
            'bg-blue-50'
          }`}
        >
          {alert.type === 'connection' ? (
            <WifiOff className="h-5 w-5 text-red-500 flex-shrink-0" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
          )}
          <div>
            <p className="text-sm font-medium text-gray-800">{alert.message}</p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(alert.timestamp).toLocaleTimeString()}
            </p>
          </div>
        </div>
      ))}
      {alerts.length === 0 && (
        <p className="text-center text-gray-500 py-4">No alerts</p>
      )}
    </div>
  );
}