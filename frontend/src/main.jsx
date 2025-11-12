import { StrictMode, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css'; 
import App from './App.jsx';
import { pdfjs } from 'react-pdf';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { getDesignTokens } from './theme';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

function Root() {
  const [mode, setMode] = useState('light');

  const theme = useMemo(() => getDesignTokens(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App mode={mode} toggleMode={() => setMode(mode === 'light' ? 'dark' : 'light')} />
    </ThemeProvider>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
