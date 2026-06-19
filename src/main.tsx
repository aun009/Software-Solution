import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { disableNativeScrollRestoration, hasStoreReturnPending } from './lib/scrollRestoration';
import './index.css';

disableNativeScrollRestoration();

if (typeof window !== 'undefined') {
  window.addEventListener('pageshow', (event) => {
    disableNativeScrollRestoration();

    const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    if ((event.persisted || navEntry?.type === 'back_forward') && !hasStoreReturnPending()) {
      requestAnimationFrame(() => window.scrollTo(0, 0));
    }
  });
}

console.log('Mounting NexusAI Showcase...');

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
} else {
  console.error('Root element not found');
}
