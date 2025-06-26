
interface ErrorLogData {
  component: string;
  error: Error;
  context?: Record<string, any>;
  timestamp: number;
  userAgent: string;
  url: string;
}

class ErrorLogger {
  private static instance: ErrorLogger;
  
  private constructor() {}
  
  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }
  
  logError(component: string, error: Error, context?: Record<string, any>) {
    const errorData: ErrorLogData = {
      component,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      } as Error,
      context,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    console.error('CRD Error:', {
      ...errorData,
      errorString: `[${component}] ${error.name}: ${error.message}`
    });
    
    // In production, you could send this to an error tracking service
    // this.sendToErrorService(errorData);
  }
  
  logWebGLError(component: string, error: Error, contextLost: boolean = false) {
    this.logError(component, error, {
      webgl: true,
      contextLost,
      webglSupported: this.checkWebGLSupport()
    });
  }
  
  logResourceError(component: string, resource: string, error: Error) {
    this.logError(component, error, {
      resourceType: 'loading',
      resource,
      loadTime: performance.now()
    });
  }
  
  private checkWebGLSupport(): boolean {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return !!gl;
    } catch {
      return false;
    }
  }
}

export const errorLogger = ErrorLogger.getInstance();
