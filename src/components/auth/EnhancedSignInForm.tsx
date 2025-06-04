
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CRDButton } from '@/components/ui/design-system';
import { useAuth } from '@/contexts/AuthProvider';
import { AuthFormContainer } from './components/AuthFormContainer';
import { UsernameField } from './components/UsernameField';
import { PasscodeField } from './components/PasscodeField';
import { DevLoginButton } from './components/DevLoginButton';
import { customDevAuthService } from '@/features/auth/services/customDevAuthService';
import { toast } from '@/hooks/use-toast';
import { Eye, EyeOff, Shield, User, Lock } from 'lucide-react';

export const EnhancedSignInForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTime, setLockTime] = useState<number | null>(null);
  
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const maxAttempts = 5;
  const lockDuration = 5 * 60 * 1000; // 5 minutes

  // Auto-fill dev credentials and handle remember me
  useEffect(() => {
    if (customDevAuthService.isDevMode()) {
      const { username: devUsername, passcode: devPasscode } = customDevAuthService.getDevCredentials();
      setUsername(devUsername);
      setPasscode(devPasscode);
      console.log('🔧 Dev mode: Auto-filled credentials');
    }

    // Load remembered credentials
    const remembered = localStorage.getItem('cardshow_remember_credentials');
    if (remembered) {
      try {
        const { username: savedUsername, rememberMe: savedRemember } = JSON.parse(remembered);
        if (savedRemember) {
          setUsername(savedUsername);
          setRememberMe(true);
        }
      } catch (error) {
        console.error('Error loading remembered credentials:', error);
      }
    }

    // Check if account is locked
    const lockData = localStorage.getItem('cardshow_login_lock');
    if (lockData) {
      try {
        const { lockUntil, attempts: savedAttempts } = JSON.parse(lockData);
        if (Date.now() < lockUntil) {
          setIsLocked(true);
          setLockTime(lockUntil);
          setAttempts(savedAttempts);
        } else {
          localStorage.removeItem('cardshow_login_lock');
        }
      } catch (error) {
        localStorage.removeItem('cardshow_login_lock');
      }
    }
  }, []);

  // Handle lock timer
  useEffect(() => {
    if (isLocked && lockTime) {
      const timer = setInterval(() => {
        if (Date.now() >= lockTime) {
          setIsLocked(false);
          setLockTime(null);
          setAttempts(0);
          localStorage.removeItem('cardshow_login_lock');
          toast({
            title: 'Account Unlocked',
            description: 'You can now try logging in again.',
          });
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isLocked, lockTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      toast({
        title: 'Account Temporarily Locked',
        description: `Too many failed attempts. Try again in ${Math.ceil((lockTime! - Date.now()) / 60000)} minutes.`,
        variant: 'destructive',
      });
      return;
    }

    if (!username || !passcode) {
      toast({
        title: 'Missing Information',
        description: 'Please enter both username and passcode.',
        variant: 'destructive',
      });
      return;
    }

    if (passcode.length < 4) {
      toast({
        title: 'Invalid Passcode',
        description: 'Passcode must be at least 4 digits.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    console.log('🔧 Enhanced form submitting with:', { username, passcodeLength: passcode.length });
    
    const { error } = await signIn(username, passcode);
    
    if (!error) {
      console.log('🔧 Sign in successful, navigating');
      
      // Handle remember me
      if (rememberMe) {
        localStorage.setItem('cardshow_remember_credentials', JSON.stringify({
          username,
          rememberMe: true
        }));
      } else {
        localStorage.removeItem('cardshow_remember_credentials');
      }

      // Clear any lock data on successful login
      localStorage.removeItem('cardshow_login_lock');
      setAttempts(0);

      // Navigate to intended page or home
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });

      toast({
        title: 'Welcome back!',
        description: `Successfully signed in as ${username}`,
      });
    } else {
      console.error('🔧 Sign in failed:', error);
      
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= maxAttempts) {
        const lockUntil = Date.now() + lockDuration;
        setIsLocked(true);
        setLockTime(lockUntil);
        localStorage.setItem('cardshow_login_lock', JSON.stringify({
          lockUntil,
          attempts: newAttempts
        }));
        
        toast({
          title: 'Account Locked',
          description: `Too many failed attempts. Account locked for ${lockDuration / 60000} minutes.`,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Sign In Failed',
          description: `${error} (${maxAttempts - newAttempts} attempts remaining)`,
          variant: 'destructive',
        });
      }
    }
    
    setIsLoading(false);
  };

  const handleAutoFill = (devUsername: string, devPasscode: string) => {
    setUsername(devUsername);
    setPasscode(devPasscode);
    toast({
      title: 'Dev Credentials Filled',
      description: 'Ready to sign in with development account',
    });
  };

  const handleDevLogin = async () => {
    const result = await customDevAuthService.autoSignIn();
    if (!result.error) {
      console.log('🔧 Dev auto-login successful, navigating to home');
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
      toast({
        title: 'Dev Login Successful',
        description: 'Signed in with development account',
      });
    } else {
      console.error('🔧 Dev auto-login failed:', result.error);
      toast({
        title: 'Dev Login Failed',
        description: result.error,
        variant: 'destructive',
      });
    }
  };

  const getRemainingTime = () => {
    if (!lockTime) return '';
    const remaining = Math.ceil((lockTime - Date.now()) / 60000);
    return `${remaining} minute${remaining !== 1 ? 's' : ''}`;
  };

  return (
    <AuthFormContainer showOAuth={false} showSeparator={false}>
      <DevLoginButton 
        onAutoFill={handleAutoFill}
        onDevLogin={handleDevLogin}
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-crd-lightGray" />
            <UsernameField
              username={username}
              onUsernameChange={setUsername}
              disabled={isLocked}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-crd-lightGray z-10" />
            <PasscodeField
              passcode={passcode}
              onPasscodeChange={setPasscode}
              disabled={isLocked}
            />
            <button
              type="button"
              onClick={() => setShowPasscode(!showPasscode)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-crd-lightGray hover:text-crd-white"
              disabled={isLocked}
            >
              {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Remember me and security info */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-crd-lightGray">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLocked}
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
      </form>

      <div className="text-center">
        <span className="text-crd-lightGray">Don't have an account? </span>
        <Link to="/auth/signup" className="text-crd-lightGray hover:text-crd-white underline">
          Sign up
        </Link>
      </div>
    </AuthFormContainer>
  );
};
