import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css'; 
import App from './App.jsx';
import { pdfjs } from 'react-pdf';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

function Root() {
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
