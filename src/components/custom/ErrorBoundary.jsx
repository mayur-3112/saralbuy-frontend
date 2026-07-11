import React from 'react';

/**
 * App-wide error boundary. The app uses the component Router (not the data
 * router), so `errorElement` isn't available — this class component is the
 * equivalent. It shows a branded fallback instead of the raw crash screen,
 * and auto-reloads once on stale-chunk errors after a fresh deploy.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    const msg = error?.message || '';
    if (/dynamically imported module|Importing a module script failed|error loading dynamically imported|chunk/i.test(msg)) {
      const last = Number(sessionStorage.getItem('chunk-reload-ts') || 0);
      if (Date.now() - last > 10000) {
        sessionStorage.setItem('chunk-reload-ts', String(Date.now()));
        window.location.reload();
      }
    }
    console.error('ErrorBoundary caught:', error);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleHome = () => {
    window.location.assign('/');
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full text-center bg-white rounded-2xl border border-slate-100 shadow-sm p-8 space-y-5">
          <div className="mx-auto w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center">
            <svg className="w-8 h-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <div className="space-y-1.5">
            <h1 className="text-xl font-black text-slate-900">Something went wrong</h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              An unexpected error occurred. Reloading usually fixes it — your data is safe.
            </p>
          </div>
          <div className="flex gap-3 justify-center pt-1">
            <button
              onClick={this.handleHome}
              className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              Go Home
            </button>
            <button
              onClick={this.handleReload}
              className="px-5 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
