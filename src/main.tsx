
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

console.log('Main.tsx - Application starting');

// Try-catch to avoid MSW errors blocking app rendering
async function initializeApp() {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode - initializing mock service worker');
      try {
        const { worker } = await import('./mocks/browser');
        await worker.start({
          onUnhandledRequest: 'bypass',
        });
        console.log('Mock service worker started successfully');
      } catch (error) {
        console.warn('Failed to start mock service worker, but continuing app initialization:', error);
      }
    }
  } catch (error) {
    console.warn('Error during app initialization, but continuing:', error);
  } finally {
    console.log('Rendering app to DOM');
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
}

initializeApp();
