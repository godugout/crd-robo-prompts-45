
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

interface UseSecurityLockProps {
  maxAttempts?: number;
  lockDuration?: number;
}

export const useSecurityLock = ({ 
  maxAttempts = 5, 
  lockDuration = 5 * 60 * 1000 
}: UseSecurityLockProps = {}) => {
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTime, setLockTime] = useState<number | null>(null);

  // Check if account is locked on mount
  useEffect(() => {
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

  const recordFailedAttempt = () => {
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
        description: `Invalid credentials (${maxAttempts - newAttempts} attempts remaining)`,
        variant: 'destructive',
      });
    }
  };

  const clearLock = () => {
    localStorage.removeItem('cardshow_login_lock');
    setAttempts(0);
    setIsLocked(false);
    setLockTime(null);
  };

  return {
    attempts,
    isLocked,
    lockTime,
    maxAttempts,
    recordFailedAttempt,
    clearLock,
  };
};
