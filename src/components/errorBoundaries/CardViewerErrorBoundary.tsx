
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { errorLogger } from '@/utils/errorLogger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onWebGLContextLoss?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  isWebGLError: boolean;
  retryCount: number;
}

export class CardViewerErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;
  
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      isWebGLError: false,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): State {
    const isWebGLError = error.message.includes('WebGL') || 
                        error.message.includes('context') ||
                        error.name === 'WebGLContextLostError';
    
    return { 
      hasError: true, 
      error,
      isWebGLError,
      retryCount: 0
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    errorLogger.logWebGLError('CardViewer', error, this.state.isWebGLError);
    
    if (this.state.isWebGLError) {
      this.props.onWebGLContextLoss?.();
    }
  }

  handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: undefined,
        isWebGLError: false,
        retryCount: prevState.retryCount + 1
      }));
    }
  };

  handleFallbackTo2D = () => {
    // Force 2D mode
    localStorage.setItem('crd-force-2d', 'true');
    this.handleRetry();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-crd-darkest to-crd-dark p-8">
          <div className="text-center max-w-md bg-black/20 backdrop-blur rounded-lg p-6 border border-white/10">
            <AlertTriangle className="w-16 h-16 text-crd-green mx-auto mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">
              {this.state.isWebGLError ? '3D Viewer Error' : 'Card Viewer Error'}
            </h3>
            <p className="text-white/80 text-sm mb-4">
              {this.state.isWebGLError 
                ? 'The 3D card viewer encountered a WebGL error. Your graphics card or browser may not support advanced 3D features.'
                : 'The card viewer encountered an unexpected error.'
              }
            </p>
            
            <div className="flex flex-col gap-2">
              {this.state.retryCount < this.maxRetries && (
                <Button
                  onClick={this.handleRetry}
                  className="bg-crd-green text-black hover:bg-crd-green/90"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again ({this.maxRetries - this.state.retryCount} left)
                </Button>
              )}
              
              {this.state.isWebGLError && (
                <Button
                  onClick={this.handleFallbackTo2D}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Monitor className="w-4 h-4 mr-2" />
                  Switch to 2D Mode
                </Button>
              )}
            </div>
            
            {this.state.retryCount >= this.maxRetries && (
              <p className="text-xs text-white/60 mt-3">
                Maximum retry attempts reached. Please refresh the page or contact support.
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
