import React from 'react';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import { BrowserRouter } from 'react-router-dom';
import AppProvider from './contexts';
import { Routes } from './routes/Routes';
import './styles/global.scss';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes />
      </AppProvider>
    </BrowserRouter>
  );
};

export default App;
