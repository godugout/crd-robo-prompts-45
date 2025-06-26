
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { errorLogger } from '@/utils/errorLogger';

interface Props {
  children: ReactNode;
  collectionId?: string;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  isDataError: boolean;
  retryCount: number;
}

export class CollectionErrorBoundary extends Component<Props, State> {
  private maxRetries = 2;
  
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      isDataError: false,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): State {
    const isDataError = error.message.includes('fetch') || 
                       error.message.includes('network') ||
                       error.message.includes('404') ||
                       error.name === 'NetworkError';
    
    return { 
      hasError: true, 
      error,
      isDataError,
      retryCount: 0
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    errorLogger.logError('Collection', error, {
      collectionId: this.props.collectionId,
      isDataError: this.state.isDataError,
      componentStack: errorInfo.componentStack
    });
  }

  handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: undefined,
        isDataError: false,
        retryCount: prevState.retryCount + 1
      }));
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="w-full h-full flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            {this.state.isDataError ? (
              <>
                <Database className="w-16 h-16 text-crd-blue mx-auto mb-4" />
                <h3 className="text-white text-lg font-semibold mb-2">
                  Collection Loading Error
                </h3>
                <p className="text-white/80 text-sm mb-4">
                  Unable to load collection data. Please check your connection and try again.
                </p>
              </>
            ) : (
              <>
                <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h3 className="text-white text-lg font-semibold mb-2">
                  Collection Error
                </h3>
                <p className="text-white/80 text-sm mb-4">
                  Something went wrong while displaying this collection.
                </p>
              </>
            )}
            
            {this.state.retryCount < this.maxRetries && (
              <Button
                onClick={this.handleRetry}
                className="bg-crd-green text-black hover:bg-crd-green/90"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry ({this.maxRetries - this.state.retryCount} left)
              </Button>
            )}
            
            {this.state.retryCount >= this.maxRetries && (
              <div className="space-y-4">
                <p className="text-xs text-white/60">
                  Unable to load after multiple attempts
                </p>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4 mx-auto bg-white/10" />
                  <Skeleton className="h-4 w-1/2 mx-auto bg-white/10" />
                  <Skeleton className="h-8 w-full bg-white/10" />
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
