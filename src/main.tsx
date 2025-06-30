import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// ✅ Log that the app loaded
console.log("✅ App loaded");

// ✅ Catch global JS errors
window.onerror = function (message, source, lineno, colno, error) {
  console.error("❌ Global Error:", message, source, lineno, colno, error);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

