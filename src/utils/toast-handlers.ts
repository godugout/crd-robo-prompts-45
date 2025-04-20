
import { toast } from 'sonner';

export const successToast = (title: string, description?: string) => {
  toast.success(title, { description });
};

export const errorToast = (title: string, error: Error | string) => {
  const errorMessage = typeof error === 'string' ? error : error.message;
  toast.error(title, { description: errorMessage });
};

export const warningToast = (title: string, description?: string) => {
  toast.warning(title, { description });
};

export const infoToast = (title: string, description?: string) => {
  toast(title, { description });
};

export const handleApiError = (error: any, fallbackMessage = 'An error occurred') => {
  console.error('API Error:', error);
  const errorMessage = error?.message || fallbackMessage;
  errorToast('Error', errorMessage);
  return errorMessage;
};
