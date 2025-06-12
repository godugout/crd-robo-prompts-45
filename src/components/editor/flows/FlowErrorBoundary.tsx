
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface FlowErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class FlowErrorBoundary extends React.Component<
  { children: React.ReactNode; flowName: string },
  FlowErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode; flowName: string }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): FlowErrorBoundaryState {
    console.error('Flow Error Boundary caught error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Flow Error Details:', { error, errorInfo, flowName: this.props.flowName });
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-crd-darkest flex items-center justify-center p-4">
          <Card className="max-w-md w-full bg-editor-dark border-red-500/50 text-center p-6">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">
              {this.props.flowName} Flow Error
            </h2>
            <p className="text-gray-400 mb-4">
              Something went wrong loading this creation flow.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Error: {this.state.error?.message}
            </p>
            <Button
              onClick={() => {
                this.setState({ hasError: false, error: undefined, errorInfo: undefined });
                window.location.href = '/cards';
              }}
              className="bg-crd-green text-black hover:bg-crd-green/90"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Back to Card Hub
            </Button>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
