
import React from 'react';
import { CRDInput } from '@/components/ui/design-system';
import { Label } from '@/components/ui/label';
import { Mail, User } from 'lucide-react';

interface UserInfoFieldsProps {
  fullName: string;
  username: string;
  email: string;
  onFullNameChange: (value: string) => void;
  onUsernameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
}

export const UserInfoFields: React.FC<UserInfoFieldsProps> = ({
  fullName,
  username,
  email,
  onFullNameChange,
  onUsernameChange,
  onEmailChange,
}) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-crd-white">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-crd-lightGray h-4 w-4" />
            <CRDInput
              id="fullName"
              variant="crd"
              placeholder="Full name"
              value={fullName}
              onChange={(e) => onFullNameChange(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="username" className="text-crd-white">Username</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-crd-lightGray h-4 w-4" />
            <CRDInput
              id="username"
              variant="crd"
              placeholder="Username"
              value={username}
              onChange={(e) => onUsernameChange(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-crd-white">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-crd-lightGray h-4 w-4" />
          <CRDInput
            id="email"
            type="email"
            variant="crd"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>
    </>
  );
};
