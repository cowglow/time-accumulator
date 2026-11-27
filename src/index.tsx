import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import { AppStateProvider } from './contexts/AppStateContext';
import { RouterProvider } from './contexts/RouterContext';

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <RouterProvider>
      <AppStateProvider>
        <App />
      </AppStateProvider>
    </RouterProvider>
  </React.StrictMode>
);
