import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';
import { NexusErrorBoundary } from './components/NexusErrorBoundary';

// Register Service Worker for offline caching & progressive web app functionality
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  registerSW({
    immediate: true,
    onNeedRefresh() {
      console.log('NexusBook: Nowa wersja archiwum jest gotowa.');
    },
    onOfflineReady() {
      console.log('NexusBook: Archiwum jest w pełni przygotowane do działania w trybie offline.');
    },
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NexusErrorBoundary moduleName="NexusRoot">
      <App />
    </NexusErrorBoundary>
  </StrictMode>,
);

