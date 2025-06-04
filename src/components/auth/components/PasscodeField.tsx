
import React, { useState } from 'react';
import { CRDInput } from '@/components/ui/design-system';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Hash } from 'lucide-react';

interface PasscodeFieldProps {
  passcode: string;
  onPasscodeChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
}

export const PasscodeField: React.FC<PasscodeFieldProps> = ({
  passcode,
  onPasscodeChange,
  error,
  placeholder = "Enter your 4-8 digit passcode",
  label = "Passcode",
  required = true,
  disabled = false,
}) => {
  const [showPasscode, setShowPasscode] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and limit to 8 digits
    if (/^\d{0,8}$/.test(value)) {
      onPasscodeChange(value);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="passcode" className="text-crd-white">{label}</Label>
      <div className="relative">
        <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-crd-lightGray h-4 w-4 pointer-events-none z-10" />
        <CRDInput
          id="passcode"
          type={showPasscode ? 'text' : 'password'}
          variant="crd"
          placeholder={placeholder}
          value={passcode}
          onChange={handleChange}
          className="pl-10 pr-10 relative z-0"
          required={required}
          disabled={disabled}
          autoComplete="current-password"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={8}
          autoFocus={false}
        />
        <button
          type="button"
          onClick={() => setShowPasscode(!showPasscode)}
          disabled={disabled}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-crd-lightGray hover:text-crd-white disabled:opacity-50 disabled:cursor-not-allowed pointer-events-auto z-10"
          tabIndex={-1}
        >
          {showPasscode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <p className="text-xs text-crd-lightGray">Enter 4-8 digits only</p>
    </div>
  );
};
