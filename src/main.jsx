import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';
axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById('root')).render(
  
    <BrowserRouter>
      <App />
    </BrowserRouter>
);