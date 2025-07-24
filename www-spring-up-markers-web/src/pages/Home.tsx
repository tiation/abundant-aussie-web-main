import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home-page">
      <section className="hero-section">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-content"
        >
          <h1>Revolutionary Spring-Up Markers</h1>
          <p className="hero-subtitle">
            Self-righting technology that eliminates fallen marker hazards in mining and construction sites
          </p>
          <div className="hero-buttons">
            <Link to="/demo" className="cta-button primary">
              See Live Demo
            </Link>
            <button className="cta-button secondary">
              Contact Sales
            </button>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="hero-visual"
        >
          <div className="marker-showcase">
            <motion.div
              className="showcase-marker"
              animate={{
                rotate: [0, -45, 0],
                scale: [1, 0.9, 1]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              🚩
            </motion.div>
          </div>
        </motion.div>
      </section>

      <section className="features-section">
        <div className="features-container">
          <h2>Why Choose Spring-Up Markers?</h2>
          <div className="features-grid">
            {[
              {
                icon: '⚡',
                title: 'Instant Recovery',
                description: 'Self-rights within 2 seconds of being knocked down'
              },
              {
                icon: '🛡️',
                title: 'Built to Last',
                description: 'Withstands 1000+ impact cycles in extreme conditions'
              },
              {
                icon: '💰',
                title: 'Cost Effective',
                description: 'Eliminates downtime and manual marker replacement costs'
              },
              {
                icon: '🌐',
                title: 'Smart Monitoring',
                description: 'Real-time status updates and remote monitoring capability'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="stats-container">
          <h2>Proven Results</h2>
          <div className="stats-grid">
            {[
              { number: '99.7%', label: 'Success Rate', suffix: '' },
              { number: '2', label: 'Second Recovery', suffix: 's' },
              { number: '1000', label: 'Impact Cycles', suffix: '+' },
              { number: '50', label: 'Sites Deployed', suffix: '+' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="stat-item"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="stat-number">
                  {stat.number}<span className="stat-suffix">{stat.suffix}</span>
                </div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="cta-content"
        >
          <h2>Ready to Transform Your Site Safety?</h2>
          <p>Join the companies already benefiting from Spring-Up Marker technology</p>
          <div className="cta-buttons">
            <Link to="/demo" className="cta-button primary large">
              Experience the Demo
            </Link>
            <button className="cta-button secondary large">
              Get Pricing
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
