import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Demo from './pages/Demo'
import './styles/App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <nav className="nav-container">
            <div className="nav-brand">
              <Link to="/" className="brand-link">
                <h1>Spring Up Markers</h1>
              </Link>
            </div>
            <div className="nav-links">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/demo" className="nav-link">Demo</Link>
              <button className="contact-sales-btn">Contact Sales</button>
            </div>
          </nav>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/demo" element={<Demo />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <div className="footer-content">
            <p>&copy; 2024 Spring Up Markers. All rights reserved.</p>
            <p>Innovative marking solutions for mining and construction.</p>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App
