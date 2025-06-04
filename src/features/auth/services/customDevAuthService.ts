
interface CustomUser {
  id: string;
  username: string;
}

export class CustomDevAuthService {
  private static readonly DEV_USER_USERNAME = 'jay@godugout.com';
  private static readonly DEV_USER_PASSCODE = 'ChangeMe';

  isDevMode(): boolean {
    return typeof window !== 'undefined' && window.location.hostname === 'localhost';
  }

  async autoSignIn(): Promise<{ user: CustomUser | null; error: string | null }> {
    if (!this.isDevMode()) {
      return { user: null, error: 'Dev auth only works in development' };
    }

    console.log('🔧 Development: Auto-signing in as', CustomDevAuthService.DEV_USER_USERNAME);
    
    // Import dynamically to avoid circular dependency
    const { customAuthService } = await import('./customAuthService');
    
    try {
      const result = await customAuthService.signIn(
        CustomDevAuthService.DEV_USER_USERNAME,
        CustomDevAuthService.DEV_USER_PASSCODE
      );
      
      if (result.error) {
        console.error('🔧 Dev auto-signin failed:', result.error);
        return { user: null, error: result.error };
      }
      
      console.log('🔧 Dev auto-signin successful');
      return { user: result.user, error: null };
    } catch (error) {
      console.error('🔧 Dev auto-signin exception:', error);
      return { user: null, error: 'Auto-signin failed' };
    }
  }

  getDevCredentials() {
    return {
      username: CustomDevAuthService.DEV_USER_USERNAME,
      passcode: CustomDevAuthService.DEV_USER_PASSCODE
    };
  }
}

export const customDevAuthService = new CustomDevAuthService();
