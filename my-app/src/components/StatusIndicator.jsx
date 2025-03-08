import { Clock } from 'lucide-react';

export default function StatusIndicator({ status, lastUpdate }) {
  return (
    <div className="flex items-center gap-3 bg-white rounded-full px-4 py-2 shadow-sm">
      <span 
        className={`h-3 w-3 rounded-full animate-pulse ${
          status === 'connected' ? 'bg-green-500' : 
          status === 'connecting' ? 'bg-yellow-500' : 
          'bg-red-500'
        }`}
      />
      <span className="text-sm font-medium text-gray-600">
        {status.toUpperCase()}
      </span>
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Clock className="h-4 w-4" />
        {new Date(lastUpdate).toLocaleTimeString()}
      </div>
    </div>
  );
}