import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import { AppStateProvider } from './contexts/AppStateContext';
import { AppStageProvider } from './contexts/AppStageContext';

ReactDOM.render(
  <React.StrictMode>
    <AppStageProvider>
      <AppStateProvider>
        <App />
      </AppStateProvider>
    </AppStageProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
