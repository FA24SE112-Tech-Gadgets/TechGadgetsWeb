import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import GlobalStyles from './components/GlobalStyles';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/auth/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId="918667179231-suhe212hae2usf0v7o8bcsdj5fd81cto.apps.googleusercontent.com">
    <BrowserRouter>
      <AuthProvider>
        <GlobalStyles>
          <App />
        </GlobalStyles>
      </AuthProvider>
    </BrowserRouter>
    </GoogleOAuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
