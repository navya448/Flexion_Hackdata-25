// components/PostureGauge.jsx
import { useEffect, useState } from 'react';

const PostureGauge = ({ postureAngle, threshold }) => {
  const [angleClass, setAngleClass] = useState('good');
  
  useEffect(() => {
    if (postureAngle > threshold) {
      setAngleClass('bad');
    } else if (postureAngle > threshold * 0.7) {
      setAngleClass('warning');
    } else {
      setAngleClass('good');
    }
  }, [postureAngle, threshold]);

  // Calculate rotation based on posture angle
  const rotation = Math.min(Math.max(postureAngle, 0), 90);
  const gaugeRotation = (rotation / 90) * 180; // Map 0-90 to 0-180 for half circle

  return (
    <div className="posture-gauge">
      <h2>Posture Angle</h2>
      <div className={`gauge-container ${angleClass}`}>
        <div className="gauge-background">
          <div className="gauge-zones">
            <div className="gauge-zone good"></div>
            <div className="gauge-zone warning"></div>
            <div className="gauge-zone bad"></div>
          </div>
          <div 
            className="gauge-needle" 
            style={{ transform: `rotate(${gaugeRotation}deg)` }}
          ></div>
          <div className="gauge-center"></div>
        </div>
        <div className="gauge-value">{postureAngle}°</div>
        <div className="gauge-label">
          {angleClass === 'good' ? 'Good Posture' : 
           angleClass === 'warning' ? 'Caution' : 'Poor Posture'}
        </div>
      </div>
    </div>
  );
};

export default PostureGauge;