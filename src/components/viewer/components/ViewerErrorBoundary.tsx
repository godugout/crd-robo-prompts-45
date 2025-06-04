
import React from 'react';

interface ViewerErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ViewerErrorBoundaryProps {
  children: React.ReactNode;
}

export class ViewerErrorBoundary extends React.Component<ViewerErrorBoundaryProps, ViewerErrorBoundaryState> {
  constructor(props: ViewerErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ViewerErrorBoundaryState {
    console.error('ViewerErrorBoundary caught error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ViewerErrorBoundary error details:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <div className="text-white text-center max-w-md p-6">
            <h2 className="text-xl font-bold mb-4 text-red-400">Viewer Error</h2>
            <p className="text-gray-300 mb-4">
              The card viewer encountered an error and couldn't render properly.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Error: {this.state.error?.message || 'Unknown error'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-crd-green text-black px-4 py-2 rounded hover:bg-crd-green/80 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
