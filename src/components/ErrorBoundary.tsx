import { Component, type ErrorInfo, type ReactNode } from 'react';
import { BrandLogo } from './BrandLogo';
import { RotateCcw, Home, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6 text-charcoal">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-burgundy-100/60 text-center">
            <div className="flex justify-center mb-6">
              <BrandLogo size="lg" />
            </div>

            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-200">
              <AlertTriangle className="h-7 w-7" />
            </div>

            <h2 className="font-serif text-2xl font-bold text-burgundy-950">
              Something went wrong
            </h2>
            <p className="mt-2 text-xs text-charcoal/60 leading-relaxed">
              We encountered an unexpected display issue on this page. Your saved wedding data is completely safe.
            </p>

            {this.state.error && (
              <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-left">
                <p className="text-xs font-bold text-rose-800">Error Details:</p>
                <p className="text-[11px] text-rose-700 font-mono mt-1 break-words">
                  {this.state.error.message || String(this.state.error)}
                </p>
              </div>
            )}

            <div className="mt-6 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={this.handleReload}
                className="btn-gold flex items-center justify-center gap-2 py-2.5 text-xs font-semibold shadow-sm"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reload Page</span>
              </button>

              <button
                type="button"
                onClick={this.handleReset}
                className="flex items-center justify-center gap-2 rounded-xl border border-burgundy-200 bg-burgundy-50/60 py-2.5 text-xs font-semibold text-burgundy-800 hover:bg-burgundy-100/60 transition-colors"
              >
                <Home className="h-4 w-4" />
                <span>Return to Home</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  try {
                    localStorage.removeItem('wedding_app_auth_session_v2');
                  } catch {}
                  window.location.href = '/';
                }}
                className="text-[11px] text-charcoal/50 hover:underline mt-2"
              >
                Clear session &amp; return to homepage
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
