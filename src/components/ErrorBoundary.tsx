import { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCcw } from 'lucide-react';
import { Button } from './ui/Button';

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
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.clear();
      window.location.reload();
    } catch (err) {
      console.error('Failed to clear storage:', err);
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 shadow-lg text-center space-y-6">
            <div className="flex items-center justify-center">
              <div className="p-3 bg-red-100 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-full">
                <ShieldAlert className="h-10 w-10 animate-bounce" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-bold">Something went wrong</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                MindShield encountered an unexpected render issue. To prevent data loss, you can reset the secure workspace state.
              </p>
            </div>

            {this.state.error && (
              <pre className="p-3 rounded bg-slate-50 dark:bg-slate-950 border text-left text-[10px] overflow-auto max-h-24 text-slate-500 font-mono">
                {this.state.error.toString()}
              </pre>
            )}

            <Button
              onClick={this.handleReset}
              variant="destructive"
              className="w-full font-bold flex items-center justify-center space-x-2"
            >
              <RefreshCcw className="h-4 w-4" />
              <span>Reset Secure Workspace</span>
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
export default ErrorBoundary;
