
import React from 'react';
import { Shield } from 'lucide-react';

interface SecurityFeaturesProps {
  rememberMe: boolean;
  onRememberMeChange: (checked: boolean) => void;
  attempts: number;
  maxAttempts: number;
  isLocked: boolean;
  lockTime: number | null;
  disabled: boolean;
}

export const SecurityFeatures: React.FC<SecurityFeaturesProps> = ({
  rememberMe,
  onRememberMeChange,
  attempts,
  maxAttempts,
  isLocked,
  lockTime,
  disabled,
}) => {
  const getRemainingTime = () => {
    if (!lockTime) return '';
    const remaining = Math.ceil((lockTime - Date.now()) / 60000);
    return `${remaining} minute${remaining !== 1 ? 's' : ''}`;
  };

  return (
    <>
      {/* Remember me and security info */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-crd-lightGray">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => onRememberMeChange(e.target.checked)}
            disabled={disabled}
            className="rounded border-crd-lightGray"
          />
          Remember username
        </label>
        
        {attempts > 0 && !isLocked && (
          <div className="flex items-center gap-1 text-sm text-yellow-600">
            <Shield className="w-3 h-3" />
            {maxAttempts - attempts} attempts left
          </div>
        )}
      </div>

      {/* Lock status */}
      {isLocked && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <Shield className="w-4 h-4" />
            Account locked for {getRemainingTime()}
          </div>
        </div>
      )}
    </>
  );
};
