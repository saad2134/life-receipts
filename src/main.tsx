/**
 * Application entry point.
 * Mounts the React application tree with the ReceiptProvider
 * context at the root for centralized state management.
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ReceiptProvider } from './context/ReceiptContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ReceiptProvider>
      <App />
    </ReceiptProvider>
  </React.StrictMode>
);
