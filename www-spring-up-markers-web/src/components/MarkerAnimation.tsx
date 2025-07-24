import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MarkerAnimationProps {
  currentStep: number;
  isPlaying: boolean;
}

const MarkerAnimation: React.FC<MarkerAnimationProps> = ({ currentStep, isPlaying }) => {
  const getMarkerState = () => {
    switch (currentStep) {
      case 0: // Problem - marker is upright
        return { rotation: 0, y: 0, color: '#4CAF50' };
      case 1: // Detection - marker falls
        return { rotation: 90, y: 20, color: '#FF9800' };
      case 2: // Activation - spring mechanism
        return { rotation: 90, y: 20, color: '#FF5722' };
      case 3: // Self-righting - marker springs up
        return { rotation: 0, y: 0, color: '#2196F3' };
      case 4: // Ready - marker is stable
        return { rotation: 0, y: 0, color: '#4CAF50' };
      default:
        return { rotation: 0, y: 0, color: '#4CAF50' };
    }
  };

  const markerState = getMarkerState();

  return (
    <div className="marker-animation-container">
      <div className="construction-site">
        {/* Ground */}
        <div className="ground"></div>
        
        {/* Construction Equipment (truck) */}
        <motion.div 
          className="truck"
          animate={{ x: currentStep === 1 ? 0 : -100 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          🚛
        </motion.div>

        {/* Spring-Up Marker */}
        <motion.div
          className="marker"
          animate={{
            rotate: markerState.rotation,
            y: markerState.y,
            backgroundColor: markerState.color
          }}
          transition={{
            duration: currentStep === 3 ? 0.6 : 1,
            ease: currentStep === 3 ? "easeOut" : "easeInOut",
            type: currentStep === 3 ? "spring" : "tween",
            stiffness: currentStep === 3 ? 200 : 100
          }}
        >
          <div className="marker-pole"></div>
          <div className="marker-flag">⚠️</div>
        </motion.div>

        {/* Spring Mechanism Visualization */}
        <AnimatePresence>
          {currentStep === 2 && (
            <motion.div
              className="spring-mechanism"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="spring-coil"
                animate={{ 
                  scaleY: [1, 0.7, 1.3, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                🌀
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Impact Effect */}
        <AnimatePresence>
          {currentStep === 1 && (
            <motion.div
              className="impact-effect"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 2, 3] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              💥
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Indicator */}
        <AnimatePresence>
          {currentStep === 4 && (
            <motion.div
              className="success-indicator"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              ✅ Ready for Next Impact
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Technical Readout */}
      <div className="technical-readout">
        <div className="readout-item">
          <span className="label">Status:</span>
          <span className={`value ${currentStep === 4 ? 'success' : currentStep === 1 ? 'warning' : 'normal'}`}>
            {currentStep === 0 && 'Operational'}
            {currentStep === 1 && 'Impact Detected'}
            {currentStep === 2 && 'Spring Activating'}
            {currentStep === 3 && 'Self-Righting'}
            {currentStep === 4 && 'Fully Operational'}
          </span>
        </div>
        <div className="readout-item">
          <span className="label">Angle:</span>
          <span className="value">{markerState.rotation}°</span>
        </div>
        <div className="readout-item">
          <span className="label">Response Time:</span>
          <span className="value">
            {currentStep <= 1 ? '0.0s' : currentStep === 2 ? '0.5s' : currentStep === 3 ? '1.2s' : '2.0s'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MarkerAnimation;
