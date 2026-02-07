import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

/**
 * PWA Service Worker Registration
 * This enables offline functionality and allows the "Add to Home Screen" 
 * prompt to appear on mobile browsers.
 */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // We use './sw.js' to ensure the path is relative to your GitHub repository root
    navigator.serviceWorker.register('./sw.js')
      .then((registration) => {
        console.log('SW registered with scope:', registration.scope);
      })
      .catch((error) => {
        console.error('SW registration failed:', error);
      });
  });
}
