import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import './styles/global.css';
import { App } from './App.tsx';

/*
 * Refuse to start inside a frame. A framed copy of the application could be
 * overlaid with decoy content to trick someone into clicking (clickjacking).
 * This is defence in depth only: the hosting layer must also send
 * `Content-Security-Policy: frame-ancestors 'none'`, which a <meta> policy
 * cannot express. See SECURITY.md.
 */
if (window.self !== window.top) {
  throw new Error('Zavolt does not run inside a frame.');
}

const container = document.getElementById('root');
if (container === null) {
  throw new Error('index.html is missing the #root element.');
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
