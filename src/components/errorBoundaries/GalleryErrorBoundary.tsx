
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Boxes, RefreshCw, Grid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { errorLogger } from '@/utils/errorLogger';

interface Props {
  children: ReactNode;
  galleryId?: string;
  onFallbackToGrid?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  is3DError: boolean;
  retryCount: number;
}

export class GalleryErrorBoundary extends Component<Props, State> {
  private maxRetries = 2;
  
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      is3DError: false,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): State {
    const is3DError = error.message.includes('Three') || 
                     error.message.includes('WebGL') ||
                     error.message.includes('scene') ||
                     error.stack?.includes('three');
    
    return { 
      hasError: true, 
      error,
      is3DError,
      retryCount: 0
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    errorLogger.logError('Gallery3D', error, {
      galleryId: this.props.galleryId,
      is3DError: this.state.is3DError,
      componentStack: errorInfo.componentStack
    });
  }

  handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: undefined,
        is3DError: false,
        retryCount: prevState.retryCount + 1
      }));
    }
  };

  handleFallbackToGrid = () => {
    this.props.onFallbackToGrid?.();
    this.handleRetry();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-crd-darkest to-crd-dark p-8">
          <div className="text-center max-w-md bg-black/20 backdrop-blur rounded-lg p-6 border border-white/10">
            <Boxes className="w-16 h-16 text-crd-blue mx-auto mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">
              {this.state.is3DError ? '3D Gallery Error' : 'Gallery Error'}
            </h3>
            <p className="text-white/80 text-sm mb-4">
              {this.state.is3DError 
                ? 'The 3D gallery scene encountered an error. Your device may not support advanced 3D features.'
                : 'The gallery encountered an unexpected error.'
              }
            </p>
            
            <div className="flex flex-col gap-2">
              {this.state.retryCount < this.maxRetries && (
                <Button
                  onClick={this.handleRetry}
                  className="bg-crd-green text-black hover:bg-crd-green/90"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry 3D Gallery
                </Button>
              )}
              
              <Button
                onClick={this.handleFallbackToGrid}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Grid className="w-4 h-4 mr-2" />
                Switch to Grid View
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
