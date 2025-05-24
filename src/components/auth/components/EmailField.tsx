
import React from 'react';
import { CRDInput } from '@/components/ui/design-system';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';

interface EmailFieldProps {
  email: string;
  onEmailChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  label?: string;
  required?: boolean;
}

export const EmailField: React.FC<EmailFieldProps> = ({
  email,
  onEmailChange,
  error,
  placeholder = "Enter your email",
  label = "Email",
  required = true,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="email" className="text-crd-white">{label}</Label>
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-crd-lightGray h-4 w-4" />
        <CRDInput
          id="email"
          type="email"
          variant="crd"
          placeholder={placeholder}
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          className="pl-10"
          required={required}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};
