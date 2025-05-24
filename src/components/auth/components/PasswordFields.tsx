
import React, { useState } from 'react';
import { CRDInput } from '@/components/ui/design-system';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Lock } from 'lucide-react';

interface PasswordFieldsProps {
  password: string;
  confirmPassword: string;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
}

export const PasswordFields: React.FC<PasswordFieldsProps> = ({
  password,
  confirmPassword,
  onPasswordChange,
  onConfirmPasswordChange,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-crd-white">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-crd-lightGray h-4 w-4" />
          <CRDInput
            id="password"
            type={showPassword ? 'text' : 'password'}
            variant="crd"
            placeholder="Create a password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            className="pl-10 pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-crd-lightGray hover:text-crd-white"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-crd-white">Confirm Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-crd-lightGray h-4 w-4" />
          <CRDInput
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            variant="crd"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => onConfirmPasswordChange(e.target.value)}
            className="pl-10 pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-crd-lightGray hover:text-crd-white"
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </>
  );
};
