import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './App';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { Toaster } from 'sonner';
import { TooltipProvider } from './components/ui/tooltip';
import SocketProvider from './context/SocketProvider';
import ErrorBoundary from './components/custom/ErrorBoundary';

// Globally prevent mouse wheel from changing values on focused numeric inputs
document.addEventListener('wheel', function(e) {
  if (document.activeElement.type === 'number') {
    document.activeElement.blur();
  }
}, { passive: true });

// After a new deploy, old lazy-loaded chunk hashes 404 for users who still have
// the previous build open ("Failed to fetch dynamically imported module").
// Auto-reload once to pull the fresh assets instead of showing a crash screen.
const RELOAD_FLAG = 'chunk-reload-ts';
function handleChunkError() {
  const last = Number(sessionStorage.getItem(RELOAD_FLAG) || 0);
  // Guard against reload loops: only reload if we haven't in the last 10s.
  if (Date.now() - last > 10000) {
    sessionStorage.setItem(RELOAD_FLAG, String(Date.now()));
    window.location.reload();
  }
}
window.addEventListener('vite:preloadError', e => {
  e.preventDefault();
  handleChunkError();
});
window.addEventListener('error', e => {
  const msg = e?.message || '';
  if (/dynamically imported module|Importing a module script failed|error loading dynamically imported/i.test(msg)) {
    handleChunkError();
  }
});

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <Provider store={store}>
      <SocketProvider>
        <Toaster richColors />
        <TooltipProvider>
          <App />
        </TooltipProvider>
      </SocketProvider>
    </Provider>
  </ErrorBoundary>
);
