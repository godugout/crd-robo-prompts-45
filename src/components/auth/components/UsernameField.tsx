
import React from 'react';
import { CRDInput } from '@/components/ui/design-system';
import { Label } from '@/components/ui/label';
import { User } from 'lucide-react';

interface UsernameFieldProps {
  username: string;
  onUsernameChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  label?: string;
  required?: boolean;
}

export const UsernameField: React.FC<UsernameFieldProps> = ({
  username,
  onUsernameChange,
  error,
  placeholder = "Enter your username",
  label = "Username",
  required = true,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="username" className="text-crd-white">{label}</Label>
      <div className="relative">
        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-crd-lightGray h-4 w-4" />
        <CRDInput
          id="username"
          type="text"
          variant="crd"
          placeholder={placeholder}
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          className="pl-10"
          required={required}
          autoComplete="username"
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};
