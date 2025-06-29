
import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
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
    this.props.onReset?.();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="max-w-2xl mx-auto mt-8 p-8 bg-red-50 border-red-200">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-800 mb-2">PSD Processing Error</h2>
            <p className="text-red-600 mb-6">
              Something went wrong while processing your PSD file. This could be due to:
            </p>
            
            <div className="text-left bg-white p-4 rounded-lg mb-6 border border-red-200">
              <ul className="list-disc list-inside text-red-700 space-y-1">
                <li>Complex PSD layer structures</li>
                <li>Large file sizes or memory limitations</li>
                <li>Unsupported PSD features</li>
                <li>Corrupted layer data</li>
              </ul>
            </div>

            {this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-red-700 hover:text-red-800 font-medium">
                  Technical Details
                </summary>
                <pre className="mt-2 p-3 bg-red-100 rounded text-xs overflow-auto max-h-32 text-red-800">
                  {this.state.error.message}
                  {this.state.error.stack && '\n\nStack trace:\n' + this.state.error.stack}
                </pre>
              </details>
            )}
            
            <div className="flex gap-4 justify-center">
              <Button
                onClick={this.handleRetry}
                className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>
              
              <Button
                onClick={this.handleGoHome}
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-50 flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Go Home
              </Button>
            </div>
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}
