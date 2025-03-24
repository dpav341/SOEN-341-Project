import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Snowfall from 'react-snowfall';

const root = ReactDOM.createRoot(document.getElementById('root')); // Make sure 'root' is the ID in your index.html

root.render(
  <React.StrictMode>
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      <Snowfall />
      <App />
    </div>
  </React.StrictMode>
);

reportWebVitals();
