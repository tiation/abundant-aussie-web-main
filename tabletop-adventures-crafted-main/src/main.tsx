
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Using createRoot API instead of render
createRoot(document.getElementById("root")!).render(<App />);
