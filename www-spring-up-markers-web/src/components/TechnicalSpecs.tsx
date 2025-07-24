import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TechnicalSpecs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('materials');

  const specifications = {
    materials: {
      title: 'Materials & Construction',
      specs: [
        { label: 'Outer Shell', value: 'High-Density Polyethylene (HDPE)', detail: 'UV-resistant, impact-resistant polymer' },
        { label: 'Spring Mechanism', value: 'Stainless Steel 316L', detail: 'Corrosion-resistant, high-fatigue strength' },
        { label: 'Base Weight', value: '2.5kg stabilizing ballast', detail: 'Prevents tipping in normal conditions' },
        { label: 'Impact Sensor', value: 'Accelerometer + Gyroscope', detail: 'Detects orientation changes instantly' },
        { label: 'Sealing Rating', value: 'IP67 Waterproof', detail: 'Complete protection against dust and water' }
      ]
    },
    performance: {
      title: 'Performance Metrics',
      specs: [
        { label: 'Response Time', value: '< 2 seconds', detail: 'From impact to full upright position' },
        { label: 'Impact Cycles', value: '1000+ cycles', detail: 'Tested fall-recovery operations' },
        { label: 'Operating Temperature', value: '-40°C to +70°C', detail: 'Extreme weather performance' },
        { label: 'Wind Resistance', value: '120 km/h gusts', detail: 'Maintains stability in severe weather' },
        { label: 'Visibility Range', value: '500m daylight', detail: 'High-visibility reflective materials' }
      ]
    },
    deployment: {
      title: 'Deployment & Installation',
      specs: [
        { label: 'Setup Time', value: '< 30 seconds', detail: 'No tools required for installation' },
        { label: 'Height Options', value: '0.6m, 1.0m, 1.5m', detail: 'Multiple sizes for different applications' },
        { label: 'Base Diameter', value: '300mm standard', detail: 'Stable footprint for all conditions' },
        { label: 'Power Source', value: 'Self-contained battery', detail: '3-year battery life with solar charging' },
        { label: 'Wireless Range', value: '1km status reporting', detail: 'Real-time monitoring capability' }
      ]
    },
    compliance: {
      title: 'Standards & Compliance',
      specs: [
        { label: 'Safety Standards', value: 'ISO 45001, OSHA Compliant', detail: 'Meets international safety requirements' },
        { label: 'Environmental', value: 'RoHS, REACH Certified', detail: 'Environmentally responsible materials' },
        { label: 'Quality System', value: 'ISO 9001:2015', detail: 'Certified quality management' },
        { label: 'Testing Standards', value: 'ASTM D6253, IEC 62133', detail: 'Rigorous testing protocols' },
        { label: 'Warranty', value: '5-year full warranty', detail: 'Comprehensive coverage and support' }
      ]
    }
  };

  const tabs = Object.keys(specifications);

  return (
    <div className="technical-specs-container">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="specs-header"
      >
        <h2>Technical Specifications</h2>
        <p>Engineered for reliability, built for extreme conditions</p>
      </motion.div>

      <div className="specs-tabs">
        {tabs.map((tab) => (
          <motion.button
            key={tab}
            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {specifications[tab as keyof typeof specifications].title}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="specs-content"
        >
          <div className="specs-grid">
            {specifications[activeTab as keyof typeof specifications].specs.map((spec, index) => (
              <motion.div
                key={index}
                className="spec-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, boxShadow: "0 8px 25px rgba(0,0,0,0.15)" }}
              >
                <div className="spec-header">
                  <h4>{spec.label}</h4>
                  <div className="spec-value">{spec.value}</div>
                </div>
                <p className="spec-detail">{spec.detail}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Performance Chart */}
      <motion.div 
        className="performance-chart"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <h3>Performance Over Time</h3>
        <div className="chart-visual">
          <div className="chart-bars">
            {[
              { label: 'Day 1', height: '100%', color: '#4CAF50' },
              { label: 'Month 6', height: '98%', color: '#4CAF50' },
              { label: 'Year 1', height: '95%', color: '#8BC34A' },
              { label: 'Year 3', height: '92%', color: '#CDDC39' },
              { label: 'Year 5', height: '90%', color: '#FFC107' }
            ].map((bar, index) => (
              <motion.div
                key={index}
                className="chart-bar"
                initial={{ height: 0 }}
                whileInView={{ height: bar.height }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                style={{ backgroundColor: bar.color }}
              >
                <div className="bar-label">{bar.label}</div>
                <div className="bar-value">{bar.height}</div>
              </motion.div>
            ))}
          </div>
          <div className="chart-axis">
            <span>Response Time Reliability</span>
          </div>
        </div>
      </motion.div>

      {/* Certifications */}
      <motion.div 
        className="certifications"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h3>Certifications & Awards</h3>
        <div className="cert-grid">
          {[
            { name: 'ISO 45001', icon: '🏆', description: 'Occupational Health & Safety' },
            { name: 'OSHA Compliant', icon: '✅', description: 'US Safety Standards' },
            { name: 'CE Marking', icon: '🇪🇺', description: 'European Conformity' },
            { name: 'Innovation Award', icon: '🥇', description: 'Mining Technology 2024' }
          ].map((cert, index) => (
            <motion.div
              key={index}
              className="cert-item"
              whileHover={{ scale: 1.05, rotate: 2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="cert-icon">{cert.icon}</div>
              <div className="cert-name">{cert.name}</div>
              <div className="cert-description">{cert.description}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default TechnicalSpecs;
