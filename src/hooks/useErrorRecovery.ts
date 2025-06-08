
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface ErrorRecoveryState {
  hasError: boolean;
  errorCount: number;
  lastError: Error | null;
}

export const useErrorRecovery = (maxRetries = 3) => {
  const [state, setState] = useState<ErrorRecoveryState>({
    hasError: false,
    errorCount: 0,
    lastError: null
  });

  const handleError = useCallback((error: Error) => {
    setState(prev => ({
      hasError: true,
      errorCount: prev.errorCount + 1,
      lastError: error
    }));

    if (state.errorCount < maxRetries) {
      toast.error(`Operation failed: ${error.message}`, {
        description: `Retry ${state.errorCount + 1}/${maxRetries} available`
      });
    } else {
      toast.error('Maximum retries reached', {
        description: 'Please check your connection and try again later'
      });
    }
  }, [state.errorCount, maxRetries]);

  const retry = useCallback(() => {
    setState({
      hasError: false,
      errorCount: 0,
      lastError: null
    });
  }, []);

  const canRetry = state.errorCount < maxRetries;

  return {
    hasError: state.hasError,
    errorCount: state.errorCount,
    lastError: state.lastError,
    canRetry,
    handleError,
    retry
  };
};
