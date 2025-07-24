import React from 'react';
import { motion } from 'framer-motion';

const ProblemSolution: React.FC = () => {
  const problemStats = [
    { stat: '73%', description: 'of workplace accidents involve fallen markers' },
    { stat: '$2.4M', description: 'average cost of site safety incidents' },
    { stat: '45 min', description: 'average downtime to replace markers' }
  ];

  const solutionFeatures = [
    { 
      icon: '⚡',
      title: 'Instant Response',
      description: 'Self-rights within 2 seconds of impact'
    },
    {
      icon: '🔄',
      title: 'Unlimited Cycles',
      description: 'Withstands over 1000 impact-recovery cycles'
    },
    {
      icon: '🛡️',
      title: 'Weather Resistant',
      description: 'Operates in -40°C to +70°C conditions'
    }
  ];

  return (
    <div className="problem-solution-container">
      <div className="section-grid">
        {/* Problem Side */}
        <motion.div 
          className="problem-side"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="problem-header">
            <h2>The Core Problem</h2>
            <div className="problem-icon">⚠️</div>
          </div>
          
          <div className="problem-description">
            <p>
              Traditional markers in mining and construction sites create serious safety hazards when they fall. 
              Once knocked over by equipment or weather, they remain down until manually reset, leaving blind spots 
              and creating dangerous conditions.
            </p>
          </div>

          <div className="problem-image">
            <motion.div 
              className="fallen-marker-demo"
              animate={{ 
                rotate: [0, -90, -90, -90],
                backgroundColor: ['#ff6b35', '#ff3333', '#cc0000', '#990000']
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="traditional-marker">
                <div className="marker-pole"></div>
                <div className="marker-base"></div>
              </div>
            </motion.div>
            <p className="demo-caption">Traditional markers stay down when knocked over</p>
          </div>

          <div className="problem-stats">
            {problemStats.map((item, index) => (
              <motion.div 
                key={index}
                className="stat-item"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="stat-number">{item.stat}</div>
                <div className="stat-description">{item.description}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Solution Side */}
        <motion.div 
          className="solution-side"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="solution-header">
            <h2>Our Revolutionary Solution</h2>
            <div className="solution-icon">🚀</div>
          </div>
          
          <div className="solution-description">
            <p>
              Spring-Up Markers utilize cutting-edge spring technology and impact sensors to automatically 
              self-right when knocked over. This revolutionary approach ensures continuous visibility and 
              eliminates the need for manual intervention.
            </p>
          </div>

          <div className="solution-image">
            <motion.div 
              className="spring-marker-demo"
              animate={{ 
                rotate: [0, -90, -45, 0],
                backgroundColor: ['#4CAF50', '#FF9800', '#2196F3', '#4CAF50']
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeOut",
                times: [0, 0.3, 0.6, 1]
              }}
            >
              <div className="spring-marker">
                <div className="marker-pole smart"></div>
                <div className="marker-base smart"></div>
                <motion.div 
                  className="spring-indicator"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity
                  }}
                >
                  🌀
                </motion.div>
              </div>
            </motion.div>
            <p className="demo-caption">Spring-Up Markers automatically self-right</p>
          </div>

          <div className="solution-features">
            {solutionFeatures.map((feature, index) => (
              <motion.div 
                key={index}
                className="feature-item"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <div className="feature-content">
                  <h4>{feature.title}</h4>
                  <p>{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Comparison Chart */}
      <motion.div 
        className="comparison-chart"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h3>Performance Comparison</h3>
        <div className="chart-container">
          <div className="comparison-row">
            <div className="metric">Recovery Time</div>
            <div className="traditional">Manual Reset Required</div>
            <div className="spring-up">2 Seconds Automatic</div>
          </div>
          <div className="comparison-row">
            <div className="metric">Downtime Cost</div>
            <div className="traditional">$500-2000/incident</div>
            <div className="spring-up">$0</div>
          </div>
          <div className="comparison-row">
            <div className="metric">Maintenance</div>
            <div className="traditional">High - Frequent replacement</div>
            <div className="spring-up">Low - Self-maintaining</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProblemSolution;
