import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-primary-600 via-primary-400 to-primary-600 animate-gradient-x">
      <div className="text-center p-6 bg-white rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-neutral-900">Welcome to PosCalls4U</h1>
        <button className="mt-4 btn btn-primary animate-fade-in-down">Get Started</button>
      </div>
    </div>
  );
}

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
