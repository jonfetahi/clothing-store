import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { NavigationProvider } from './context/navigation-context';
import { ApiProvider } from './context/api-context';
import { AuthProvider } from './context/auth-context';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <NavigationProvider>
    <ApiProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
    </ApiProvider>
  </NavigationProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
