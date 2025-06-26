import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './app/App';
import { MusicProvider } from './context/MusicContext';
import { CartProvider } from './context/CartContext';
import './app/App.css'; // Assuming you have a global stylesheet

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <MusicProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </MusicProvider>
    </Router>
  </React.StrictMode>
);