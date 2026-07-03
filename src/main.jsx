import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './App';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { Toaster } from 'sonner';
import { TooltipProvider } from './components/ui/tooltip';
import SocketProvider from './context/SocketProvider';

// Globally prevent mouse wheel from changing values on focused numeric inputs
document.addEventListener('wheel', function(e) {
  if (document.activeElement.type === 'number') {
    document.activeElement.blur();
  }
}, { passive: true });

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <SocketProvider>
      <Toaster richColors />
      <TooltipProvider>
        <App />
      </TooltipProvider>
    </SocketProvider>
  </Provider>
);
