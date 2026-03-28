import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './routes/AppRouter';
import { AuthProvider } from './context/AuthContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <BrowserRouter>
          <AppRouter />
          <Toaster 
            position="top-right"
            toastOptions={{
              className: '',
              style: {
                background: '#1A1A1A',
                color: '#FAF9F6',
                border: '1px solid rgba(255,255,255,0.1)',
                fontFamily: '"DM Sans", sans-serif',
              },
              success: {
                iconTheme: {
                  primary: '#C9A84C',
                  secondary: '#1A1A1A',
                },
              },
              error: {
                iconTheme: {
                  primary: '#F87171',
                  secondary: '#1A1A1A',
                },
              }
            }}
          />
        </BrowserRouter>
      </SubscriptionProvider>
    </AuthProvider>
  );
}

export default App;
