
import { useState } from 'react';

export interface UseAuthFormProps<T> {
  initialValues: T;
  onSubmit: (values: T) => Promise<void>;
}

export const useAuthForm = <T extends Record<string, any>>({
  initialValues,
  onSubmit,
}: UseAuthFormProps<T>) => {
  const [formData, setFormData] = useState<T>(initialValues);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof T, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSubmit(formData);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialValues);
    setIsLoading(false);
  };

  return {
    formData,
    isLoading,
    handleInputChange,
    handleSubmit,
    resetForm,
  };
};
