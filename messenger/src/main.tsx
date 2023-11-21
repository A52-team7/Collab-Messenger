import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { ChakraBaseProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';

// 1. Import the extendTheme function
import { extendTheme } from '@chakra-ui/react';

// 2. Extend the theme to include custom colors, fonts, etc
const colors = {
  grey: '#e2ebf6',
  lightBlue: '#778DA9',
  blue: '#415A77',
  darkBlue: '#1B263B',
  megaDarkBlue: '#0D1B2A',
  baseBlue: '#3585C2'
}

const components = {
  Button: {
    variants: {
      'primaryButton': {
        bg: 'megaDarkBlue',
        color: 'white',
        _hover: {
          bg: 'hoverPrimaryButton'
        }
      },
    },
  }
}

const theme = extendTheme({ colors, components })

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraBaseProvider theme={theme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ChakraBaseProvider>
  </React.StrictMode>,
)
