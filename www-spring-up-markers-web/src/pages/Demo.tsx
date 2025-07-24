import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MarkerAnimation from '../components/MarkerAnimation';
import TechnicalSpecs from '../components/TechnicalSpecs';
import ProblemSolution from '../components/ProblemSolution';
import StepByStepDemo from '../components/StepByStepDemo';
import './Demo.css';

const Demo: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const steps = [
    {
      title: 'The Problem',
      description: 'Traditional markers fall and stay down',
      component: 'problem'
    },
    {
      title: 'Impact Detection',
      description: 'Our marker detects when it falls',
      component: 'detection'
    },
    {
      title: 'Spring Activation',
      description: 'Internal spring mechanism triggers',
      component: 'activation'
    },
    {
      title: 'Self-Righting',
      description: 'Marker springs back upright',
      component: 'righting'
    },
    {
      title: 'Ready Again',
      description: 'Marker is ready for the next impact',
      component: 'ready'
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep(0);
    }
  };

  const playDemo = () => {
    setIsPlaying(true);
    setCurrentStep(0);
    
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          clearInterval(interval);
          return 0;
        }
        return prev + 1;
      });
    }, 3000);
  };

  return (
    <div className="demo-page">
      {/* Hero Section */}
      <section className="demo-hero">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-content"
        >
          <h1>Interactive Spring-Up Markers Demo</h1>
          <p>Experience how our revolutionary technology solves the fallen marker problem</p>
        </motion.div>
      </section>

      {/* Problem & Solution Overview */}
      <section className="problem-solution-section">
        <ProblemSolution />
      </section>

      {/* Interactive Animation Section */}
      <section className="animation-section">
        <div className="demo-controls">
          <h2>See It In Action</h2>
          <div className="control-buttons">
            <button 
              onClick={playDemo} 
              className={`play-btn ${isPlaying ? 'playing' : ''}`}
              disabled={isPlaying}
            >
              {isPlaying ? 'Playing...' : 'Play Full Demo'}
            </button>
            <button onClick={nextStep} className="step-btn">Next Step</button>
          </div>
        </div>

        <div className="demo-visualization">
          <div className="step-indicator">
            <h3>Step {currentStep + 1}: {steps[currentStep].title}</h3>
            <p>{steps[currentStep].description}</p>
          </div>
          
          <MarkerAnimation currentStep={currentStep} isPlaying={isPlaying} />
          
          <div className="step-navigator">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className={`step-dot ${
                  index === currentStep ? 'active' : ''
                } ${
                  index < currentStep ? 'completed' : ''
                }`}
                onClick={() => setCurrentStep(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                {index + 1}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Step-by-Step Breakdown */}
      <section className="step-breakdown">
        <StepByStepDemo currentStep={currentStep} steps={steps} />
      </section>

      {/* Technical Specifications */}
      <section className="technical-section">
        <TechnicalSpecs />
      </section>

      {/* Call to Action */}
      <section className="demo-cta">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="cta-content"
        >
          <h2>Ready to Upgrade Your Site Safety?</h2>
          <p>Contact our sales team to learn how Spring-Up Markers can transform your operations</p>
          <motion.button
            className="contact-sales-btn cta-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Quote Now
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
};

export default Demo;

