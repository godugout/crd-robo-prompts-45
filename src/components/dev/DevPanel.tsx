
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { devAuthService } from '@/features/auth/services/devAuthService';
import { Settings, User, LogOut, ChevronDown, ChevronUp } from 'lucide-react';

const TEST_USERS = [
  { email: 'jay@godugout.com', name: 'Jay (Admin)', role: 'admin' },
  { email: 'premium@test.com', name: 'Premium User', role: 'premium' },
  { email: 'free@test.com', name: 'Free User', role: 'free' },
];

export const DevPanel: React.FC = () => {
  const { user, signOut, isDevelopment } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);

  // Only show in development
  if (!isDevelopment) return null;

  const handleSwitchUser = async (testUser: typeof TEST_USERS[0]) => {
    if (testUser.email === user?.email) return;
    
    console.log('🔧 Switching to test user:', testUser.email);
    
    // Clear current session
    devAuthService.clearDevSession();
    
    // Create new dev session for selected user
    const mockUser = {
      id: `dev_${testUser.role}_${Date.now()}`,
      email: testUser.email,
      email_confirmed_at: new Date().toISOString(),
      phone: '',
      confirmed_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
      app_metadata: {},
      user_metadata: {
        full_name: testUser.name,
        role: testUser.role
      },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      role: 'authenticated'
    } as any;

    const mockSession = {
      access_token: `dev_${testUser.role}_token_${Date.now()}`,
      refresh_token: `dev_${testUser.role}_refresh_${Date.now()}`,
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      token_type: 'bearer',
      user: mockUser
    } as any;

    localStorage.setItem('dev_auth_session', JSON.stringify(mockSession));
    localStorage.setItem('dev_auth_user', JSON.stringify(mockUser));
    
    // Force page reload to apply new auth state
    window.location.reload();
  };

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl max-w-sm">
        {/* Header */}
        <div 
          className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-800 rounded-t-lg"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-yellow-400" />
            <span className="text-white text-sm font-medium">Dev Panel</span>
          </div>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          )}
        </div>

        {/* Content */}
        {isExpanded && (
          <div className="border-t border-gray-700">
            {/* Current User */}
            <div className="p-3 bg-gray-800">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-3 h-3 text-green-400" />
                <span className="text-green-400 text-xs font-medium">Current User</span>
              </div>
              <div className="text-white text-sm">
                {user?.email || 'Not signed in'}
              </div>
              <div className="text-gray-400 text-xs">
                Role: {user?.user_metadata?.role || 'guest'}
              </div>
            </div>

            {/* Test Users */}
            <div className="p-3">
              <div className="text-gray-300 text-xs font-medium mb-2">Switch to Test User:</div>
              <div className="space-y-1">
                {TEST_USERS.map((testUser) => (
                  <button
                    key={testUser.email}
                    onClick={() => handleSwitchUser(testUser)}
                    disabled={testUser.email === user?.email}
                    className={`w-full text-left px-2 py-1 rounded text-xs transition-colors ${
                      testUser.email === user?.email
                        ? 'bg-green-900 text-green-300 cursor-not-allowed'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <div>{testUser.name}</div>
                    <div className="text-xs text-gray-500">{testUser.email}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="p-3 border-t border-gray-700">
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 w-full px-2 py-1 text-xs text-red-400 hover:bg-red-900 hover:text-red-300 rounded transition-colors"
              >
                <LogOut className="w-3 h-3" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
