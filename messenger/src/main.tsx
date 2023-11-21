import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ChakraBaseProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
  <ChakraBaseProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ChakraBaseProvider>
</React.StrictMode>,
)
