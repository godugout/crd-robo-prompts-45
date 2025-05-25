
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

console.log('Main.tsx - Application starting');

// Simplified initialization to avoid blocking issues
async function initializeApp() {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode - attempting to initialize mock service worker');
      try {
        const { worker } = await import('./mocks/browser');
        await worker.start({
          onUnhandledRequest: 'bypass',
        });
        console.log('Mock service worker started successfully');
      } catch (error) {
        console.warn('Mock service worker not available, continuing without it:', error);
      }
    }
  } catch (error) {
    console.warn('Error during app initialization, but continuing:', error);
  }

  console.log('Rendering app to DOM');
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

initializeApp().catch((error) => {
  console.error('Critical error during app initialization:', error);
  // Show a basic error message
  document.body.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #141416; color: white; font-family: system-ui;">
      <div style="text-align: center;">
        <h1>Application Error</h1>
        <p>Failed to initialize the application. Please refresh the page.</p>
        <button onclick="window.location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #22c55e; color: white; border: none; border-radius: 0.375rem; cursor: pointer;">
          Reload Page
        </button>
      </div>
    </div>
  `;
});
