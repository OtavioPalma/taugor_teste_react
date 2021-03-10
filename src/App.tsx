import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Routes } from './routes/Routes';
import './styles/global.scss';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  );
};

export default App;
