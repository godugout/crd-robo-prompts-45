
import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class PSDErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('PSD Component Error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center h-full bg-slate-900 text-white p-8 rounded-lg border border-slate-700">
          <AlertTriangle className="w-12 h-12 text-red-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">PSD Preview Error</h3>
          <p className="text-slate-400 text-center mb-4 max-w-md">
            Something went wrong while rendering the PSD preview. This could be due to a complex PSD file or rendering issue.
          </p>
          
          {this.state.error && (
            <details className="mb-4 text-sm text-slate-500 max-w-lg">
              <summary className="cursor-pointer hover:text-slate-300">Error Details</summary>
              <pre className="mt-2 p-2 bg-slate-800 rounded text-xs overflow-auto max-h-32">
                {this.state.error.message}
              </pre>
            </details>
          )}
          
          <Button
            onClick={this.handleRetry}
            className="bg-slate-700 hover:bg-slate-600 text-white flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
