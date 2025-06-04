
import React from 'react';
import { UsernameField } from './UsernameField';
import { PasscodeField } from './PasscodeField';

interface SignInFormFieldsProps {
  username: string;
  onUsernameChange: (value: string) => void;
  passcode: string;
  onPasscodeChange: (value: string) => void;
  disabled: boolean;
}

export const SignInFormFields: React.FC<SignInFormFieldsProps> = ({
  username,
  onUsernameChange,
  passcode,
  onPasscodeChange,
  disabled,
}) => {
  return (
    <div className="space-y-4">
      <UsernameField
        username={username}
        onUsernameChange={onUsernameChange}
        disabled={disabled}
      />

      <PasscodeField
        passcode={passcode}
        onPasscodeChange={onPasscodeChange}
        disabled={disabled}
      />
    </div>
  );
};
