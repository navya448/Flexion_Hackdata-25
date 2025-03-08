// components/AlertSystem.jsx
const AlertSystem = ({ alerts }) => {
    if (alerts.length === 0) {
      return (
        <div className="alerts-container">
          <div className="no-alerts">No alerts at this time. Your posture looks good!</div>
        </div>
      );
    }
  
    return (
      <div className="alerts-container">
        {alerts.map(alert => (
          <div key={alert.id} className={`alert alert-${alert.type}`}>
            <div className="alert-icon">
              {alert.type === 'posture' && '⚠️'}
              {alert.type === 'pitch' && '↕️'}
              {alert.type === 'roll' && '↔️'}
              {alert.type === 'connection' && '🔌'}
            </div>
            <div className="alert-content">
              <div className="alert-message">{alert.message}</div>
              <div className="alert-time">{new Date(alert.timestamp).toLocaleTimeString()}</div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  export default AlertSystem;
  