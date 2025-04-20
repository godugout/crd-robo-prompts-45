
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export type ErrorWithMessage = {
  message: string;
  code?: string;
  name?: string;
};

export const useErrorHandler = () => {
  const [error, setError] = useState<ErrorWithMessage | null>(null);

  useEffect(() => {
    if (error) {
      const title = error.code 
        ? `Error ${error.code}` 
        : error.name || 'Error';
        
      toast.error(title, {
        description: error.message,
        duration: 5000,
      });
    }
  }, [error]);

  const handleError = (err: unknown) => {
    console.error('Error caught by useErrorHandler:', err);
    
    if (err instanceof Error) {
      setError({
        message: err.message,
        name: err.name,
      });
      return err.message;
    }
    
    if (typeof err === 'string') {
      setError({ message: err });
      return err;
    }
    
    const unknownError = 'An unknown error occurred';
    setError({ message: unknownError });
    return unknownError;
  };

  const clearError = () => setError(null);

  return {
    error,
    setError,
    handleError,
    clearError,
  };
};
