
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface UploadErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class UploadErrorBoundary extends React.Component<
  { children: React.ReactNode },
  UploadErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): UploadErrorBoundaryState {
    console.error('Upload Error Boundary caught error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Upload Error Details:', { error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card className="p-6 text-center bg-editor-dark border-red-500/50">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Upload Error</h3>
          <p className="text-gray-400 mb-4">
            Something went wrong with the upload component.
          </p>
          <Button
            onClick={() => this.setState({ hasError: false, error: undefined })}
            className="bg-crd-green text-black hover:bg-crd-green/90"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </Card>
      );
    }

    return this.props.children;
  }
}
