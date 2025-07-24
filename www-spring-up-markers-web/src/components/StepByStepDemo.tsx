import React from 'react';
import { motion } from 'framer-motion';

interface Step {
  title: string;
  description: string;
  component: string;
}

interface StepByStepDemoProps {
  currentStep: number;
  steps: Step[];
}

const StepByStepDemo: React.FC<StepByStepDemoProps> = ({ currentStep, steps }) => {
  const stepDetails = {
    problem: {
      icon: '⚠️',
      color: '#ff6b35',
      details: [
        'Traditional markers fall when hit by equipment',
        'Remain down until manually reset',
        'Create safety blind spots',
        'Lead to workplace accidents'
      ],
      timeline: 'Ongoing issue in construction/mining'
    },
    detection: {
      icon: '📡',
      color: '#FF9800',
      details: [
        'Built-in accelerometer detects impact',
        'Gyroscope measures orientation change',
        'Triggers within milliseconds',
        'Smart filtering prevents false positives'
      ],
      timeline: '< 0.1 seconds'
    },
    activation: {
      icon: '🔧',
      color: '#FF5722',
      details: [
        'Spring mechanism receives signal',
        'Internal motor engages',
        'Stored energy releases',
        'Self-righting sequence begins'
      ],
      timeline: '0.1 - 0.5 seconds'
    },
    righting: {
      icon: '⬆️',
      color: '#2196F3',
      details: [
        'Spring pushes marker upright',
        'Weighted base provides stability',
        'Smooth, controlled motion',
        'Returns to original position'
      ],
      timeline: '0.5 - 2.0 seconds'
    },
    ready: {
      icon: '✅',
      color: '#4CAF50',
      details: [
        'Marker fully operational',
        'System resets for next impact',
        'Status transmitted to monitoring',
        'Cycle can repeat 1000+ times'
      ],
      timeline: 'Ready for next impact'
    }
  };

  const getCurrentStepDetails = () => {
    const stepKey = steps[currentStep]?.component as keyof typeof stepDetails;
    return stepDetails[stepKey] || stepDetails.problem;
  };

  const currentDetails = getCurrentStepDetails();

  return (
    <div className="step-by-step-container">
      <motion.div 
        className="step-header"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2>How It Works: Step-by-Step Breakdown</h2>
        <p>Detailed analysis of the spring-up mechanism</p>
      </motion.div>

      <div className="step-breakdown-grid">
        {/* Current Step Detail */}
        <motion.div 
          className="current-step-detail"
          key={currentStep}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div 
            className="step-detail-card"
            style={{ borderColor: currentDetails.color }}
          >
            <div className="step-icon" style={{ backgroundColor: currentDetails.color }}>
              {currentDetails.icon}
            </div>
            
            <div className="step-content">
              <h3>Step {currentStep + 1}: {steps[currentStep]?.title}</h3>
              <p className="step-description">{steps[currentStep]?.description}</p>
              
              <div className="step-timeline">
                <span className="timeline-label">Timeline:</span>
                <span className="timeline-value">{currentDetails.timeline}</span>
              </div>

              <div className="step-details-list">
                <h4>Technical Details:</h4>
                <ul>
                  {currentDetails.details.map((detail, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      {detail}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* All Steps Overview */}
        <div className="all-steps-overview">
          <h3>Complete Process Overview</h3>
          <div className="steps-timeline">
            {steps.map((step, index) => {
              const stepKey = step.component as keyof typeof stepDetails;
              const stepDetail = stepDetails[stepKey];
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;

              return (
                <motion.div
                  key={index}
                  className={`timeline-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div 
                    className="timeline-step-icon"
                    style={{ 
                      backgroundColor: isActive ? stepDetail.color : isCompleted ? '#4CAF50' : '#e0e0e0',
                      color: isActive || isCompleted ? 'white' : '#666'
                    }}
                  >
                    {isCompleted ? '✓' : stepDetail.icon}
                  </div>
                  
                  <div className="timeline-step-content">
                    <h4>{step.title}</h4>
                    <p>{stepDetail.timeline}</p>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div 
                      className="timeline-connector"
                      style={{ 
                        backgroundColor: isCompleted ? '#4CAF50' : '#e0e0e0'
                      }}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Image Gallery Section */}
      <motion.div 
        className="image-gallery"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h3>Visual Documentation</h3>
        <div className="gallery-grid">
          {[
            { title: 'Impact Detection', description: 'Sensor activation moment', image: '📸' },
            { title: 'Spring Mechanism', description: 'Internal components', image: '🔧' },
            { title: 'Self-Righting Motion', description: 'Recovery sequence', image: '📹' },
            { title: 'Field Testing', description: 'Real-world performance', image: '🏗️' }
          ].map((item, index) => (
            <motion.div
              key={index}
              className="gallery-item"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="gallery-image-placeholder">
                {item.image}
              </div>
              <div className="gallery-content">
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Performance Metrics */}
      <motion.div 
        className="performance-metrics"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <h3>Performance Metrics</h3>
        <div className="metrics-grid">
          {[
            { metric: 'Success Rate', value: '99.7%', icon: '🎯', color: '#4CAF50' },
            { metric: 'Response Time', value: '1.8s avg', icon: '⚡', color: '#FF9800' },
            { metric: 'Durability', value: '1000+ cycles', icon: '🔄', color: '#2196F3' },
            { metric: 'Accuracy', value: '±2° precision', icon: '📐', color: '#9C27B0' }
          ].map((item, index) => (
            <motion.div
              key={index}
              className="metric-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <div 
                className="metric-icon"
                style={{ backgroundColor: item.color }}
              >
                {item.icon}
              </div>
              <div className="metric-content">
                <div className="metric-value">{item.value}</div>
                <div className="metric-label">{item.metric}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default StepByStepDemo;
