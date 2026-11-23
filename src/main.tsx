import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import { LanguageProvider } from './context/LanguageContext';
import { ProjectsProvider } from './context/ProjectsContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { registerPulseOctoWebMcpTools } from './utils/webMcp';
import './index.css';

// Register WebMCP tools immediately on page load for in-browser AI agents
registerPulseOctoWebMcpTools();

// Calculate and update --vh CSS custom property on the html element for mobile viewports
const updateVh = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};
updateVh();
window.addEventListener('resize', updateVh, { passive: true });
window.addEventListener('orientationchange', updateVh, { passive: true });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <ThemeProvider>
          <LanguageProvider>
            <ProjectsProvider>
              <ToastProvider>
                <App />
              </ToastProvider>
            </ProjectsProvider>
          </LanguageProvider>
        </ThemeProvider>
      </HelmetProvider>
    </ErrorBoundary>
  </StrictMode>,
);
