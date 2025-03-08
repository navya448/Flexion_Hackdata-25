// components/StatusIndicator.jsx
const StatusIndicator = ({ status, lastUpdate }) => {
    const formatTimestamp = (timestamp) => {
      return new Date(timestamp).toLocaleTimeString();
    };
  
    return (
      <div className="status-indicator">
        <div className={`status-light ${status}`}></div>
        <div className="status-text">
          {status === 'connected' && 'Connected'}
          {status === 'connecting' && 'Connecting...'}
          {status === 'disconnected' && 'Disconnected'}
          {status === 'error' && 'Connection Error'}
        </div>
        {status === 'connected' && (
          <div className="status-timestamp">Last update: {formatTimestamp(lastUpdate)}</div>
        )}
      </div>
    );
  };
  
  export default StatusIndicator;