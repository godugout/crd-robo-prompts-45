
import React from 'react';
import { Link } from 'react-router-dom';
import { CRDButton } from '@/components/ui/design-system';

interface SignInFormActionsProps {
  isLoading: boolean;
  isLocked: boolean;
  username: string;
  passcode: string;
  lockTime: number | null;
}

export const SignInFormActions: React.FC<SignInFormActionsProps> = ({
  isLoading,
  isLocked,
  username,
  passcode,
  lockTime,
}) => {
  const getRemainingTime = () => {
    if (!lockTime) return '';
    const remaining = Math.ceil((lockTime - Date.now()) / 60000);
    return `${remaining} minute${remaining !== 1 ? 's' : ''}`;
  };

  return (
    <>
      <CRDButton
        type="submit"
        variant="outline"
        size="lg"
        className="w-full"
        disabled={isLoading || !username || !passcode || passcode.length < 4 || isLocked}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Signing in...
          </div>
        ) : isLocked ? (
          `Locked for ${getRemainingTime()}`
        ) : (
          'Sign In'
        )}
      </CRDButton>

      <div className="text-center">
        <span className="text-crd-lightGray">Don't have an account? </span>
        <Link to="/auth/signup" className="text-crd-lightGray hover:text-crd-white underline">
          Sign up
        </Link>
      </div>
    </>
  );
};
