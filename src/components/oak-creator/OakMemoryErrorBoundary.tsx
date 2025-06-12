
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class OakMemoryErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('OakMemory Error Boundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0f4c3a] to-[#1a5c47]">
          <div className="text-center p-8 bg-white/10 backdrop-blur rounded-lg max-w-md">
            <AlertTriangle className="w-16 h-16 text-[#ffd700] mx-auto mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">
              3D Viewer Error
            </h3>
            <p className="text-white/80 text-sm mb-4">
              The 3D card viewer encountered an error. Try refreshing or switch to 2D mode.
            </p>
            <Button
              onClick={this.handleReset}
              className="bg-[#ffd700] text-[#0f4c3a] hover:bg-[#ffd700]/90"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
