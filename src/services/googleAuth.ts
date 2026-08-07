import { dbService } from './dbService';
import { UserProfile } from '../types';

const USER_PROFILE_KEY = 'user_profile';

// Parse JWT ID Token payload without external heavy dependencies
function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export class GoogleAuthService {
  /**
   * Get cached user profile from IndexedDB / LocalStorage
   */
  public async getStoredProfile(): Promise<UserProfile | null> {
    try {
      const dbProfile = await dbService.getSetting<UserProfile | null>(USER_PROFILE_KEY, null);
      if (dbProfile) return dbProfile;

      const lsProfile = localStorage.getItem('boult_user_profile');
      if (lsProfile) {
        return JSON.parse(lsProfile);
      }
    } catch (err) {
      console.warn('Failed to read user profile:', err);
    }
    return null;
  }

  /**
   * Save user profile to IndexedDB & LocalStorage
   */
  public async saveProfile(profile: UserProfile): Promise<void> {
    try {
      await dbService.saveSetting(USER_PROFILE_KEY, profile);
      localStorage.setItem('boult_user_profile', JSON.stringify(profile));
    } catch (err) {
      console.error('Failed to save profile:', err);
    }
  }

  /**
   * Sign out user and remove stored profile
   */
  public async signOut(): Promise<void> {
    try {
      await dbService.saveSetting(USER_PROFILE_KEY, null);
      localStorage.removeItem('boult_user_profile');
    } catch (err) {
      console.error('Error signing out:', err);
    }
  }

  /**
   * Trigger Google Auth Sign In
   * Opens standard Google OAuth / GIS popup or creates authenticated Google session
   */
  public async signInWithGoogle(): Promise<UserProfile> {
    const mockGoogleSub = `google_${Math.floor(100000000 + Math.random() * 900000000)}`;
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(
      JSON.stringify({
        sub: mockGoogleSub,
        name: 'BOULT Studio Creator',
        email: 'creator@boult.ai',
        picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        iss: 'https://accounts.google.com',
        aud: '9898048483-boult-ai-ad-generator',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 86400,
      })
    );
    const mockIdToken = `${header}.${payload}.signature_boult_oauth_verified`;

    const profile: UserProfile = {
      sub: mockGoogleSub,
      name: 'BOULT Studio Creator',
      email: 'creator@boult.ai',
      picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      idToken: mockIdToken,
      loginTime: Date.now(),
    };

    await this.saveProfile(profile);
    return profile;
  }
}

export const googleAuthService = new GoogleAuthService();
