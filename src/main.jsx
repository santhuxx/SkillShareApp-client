import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
<<<<<<< Updated upstream

const clientId = '919979525803-4tp3gnsaqqtguv9qjledtf1rpccke5jm.apps.googleusercontent.com'; // replace with your real client ID

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={clientId}>
=======
import axios from 'axios';
axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById('root')).render(
  
>>>>>>> Stashed changes
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </GoogleOAuthProvider>
);