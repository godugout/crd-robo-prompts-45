
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Bell, Shield, Palette, Globe, User, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/use-user';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase-client';
import { BatchMediaUploader } from '@/components/media/BatchMediaUploader';

interface UserPreferences {
  darkMode: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  profileVisibility: boolean;
  showCardValue: boolean;
  compactView: boolean;
}

const Settings = () => {
  const { toast } = useToast();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

  // Form fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Preferences
  const [preferences, setPreferences] = useState<UserPreferences>({
    darkMode: false,
    emailNotifications: true,
    pushNotifications: true,
    profileVisibility: true,
    showCardValue: true,
    compactView: false
  });

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Try Supabase first
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (!error && data) {
          setProfile(data);
          setUsername(data.username || '');
          setBio(data.bio || '');
          setAvatarUrl(data.avatar_url);
          
          // Try to get user preferences
          const { data: prefsData, error: prefsError } = await supabase
            .from('ui_preferences')
            .select('*')
            .eq('user_id', user.id)
            .single();
            
          if (!prefsError && prefsData) {
            setPreferences({
              darkMode: prefsData.theme_variant === 'dark',
              emailNotifications: true,
              pushNotifications: true,
              profileVisibility: true,
              showCardValue: true,
              compactView: prefsData.reduced_motion || false
            });
          }
        }
      } catch (e) {
        console.error('Supabase error, falling back to mock:', e);
      }

      // Fallback to mock API if Supabase fails
      if (!profile && user) {
        try {
          const response = await fetch(`/api/users/${user.id}`);
          const userData = await response.json();
          
          setProfile(userData);
          setUsername(userData.username || '');
          setEmail(userData.email || '');
          setBio(userData.bio || '');
          setAvatarUrl(userData.profileImage);
          
          // Set some default preferences
          setPreferences({
            darkMode: false,
            emailNotifications: true,
            pushNotifications: true,
            profileVisibility: true,
            showCardValue: true,
            compactView: false
          });
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your profile',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Build update data
      const profileData = {
        username,
        bio,
        avatar_url: avatarUrl
      };
      
      // Try Supabase first
      try {
        const { error } = await supabase
          .from('profiles')
          .update(profileData)
          .eq('id', user.id);
          
        if (error) throw error;
        
        // Update preferences
        const preferencesData = {
          theme_variant: preferences.darkMode ? 'dark' : 'default',
          reduced_motion: preferences.compactView
        };
        
        const { data: existingPrefs } = await supabase
          .from('ui_preferences')
          .select('id')
          .eq('user_id', user.id)
          .single();
          
        if (existingPrefs) {
          await supabase
            .from('ui_preferences')
            .update(preferencesData)
            .eq('id', existingPrefs.id);
        } else {
          await supabase
            .from('ui_preferences')
            .insert({
              user_id: user.id,
              ...preferencesData
            });
        }
      } catch (e) {
        console.error('Supabase error, falling back to mock:', e);
        
        // Fallback to mock API
        await fetch(`/api/users/${user.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username,
            email,
            bio,
            profileImage: avatarUrl,
            preferences: preferences
          })
        });
      }
      
      toast({
        title: 'Success!',
        description: 'Your profile has been updated',
      });
      
      // Refresh profile data
      await fetchUserProfile();
    } catch (error) {
      console.error('Failed to save profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to save your profile',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (mediaItems: any[]) => {
    if (mediaItems.length > 0) {
      setAvatarUrl(mediaItems[0].url);
      setUploading(false);
    }
  };

  const togglePreference = (key: keyof UserPreferences) => {
    setPreferences({
      ...preferences,
      [key]: !preferences[key]
    });
  };

  return (
    <div className="min-h-screen bg-[#141416]">
      <div className="container mx-auto p-6 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#FCFCFD]">Settings</h1>
          <p className="text-[#777E90]">Manage your account preferences</p>
        </div>

        <div className="space-y-6">
          <Card className="bg-[#23262F] border-[#353945]">
            <CardHeader>
              <CardTitle className="text-[#FCFCFD] flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription className="text-[#777E90]">
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-[#FCFCFD]">Username</Label>
                <Input
                  id="username"
                  placeholder="Your username"
                  className="bg-[#353945] border-[#353945] text-[#FCFCFD]"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#FCFCFD]">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Your email"
                  className="bg-[#353945] border-[#353945] text-[#FCFCFD]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading || user?.email !== undefined}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-[#FCFCFD]">Bio</Label>
                <Input
                  id="bio"
                  placeholder="Tell us about yourself"
                  className="bg-[#353945] border-[#353945] text-[#FCFCFD]"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-[#FCFCFD]">Profile Picture</Label>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full overflow-hidden bg-[#353945] flex items-center justify-center">
                    {avatarUrl ? (
                      <img 
                        src={avatarUrl} 
                        alt="Avatar" 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-8 w-8 text-[#777E90]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <BatchMediaUploader
                      onUploadComplete={handleAvatarUpload}
                      onError={(error) => {
                        console.error('Upload error:', error);
                        toast({
                          title: 'Upload Error',
                          description: error.message,
                          variant: 'destructive'
                        });
                        setUploading(false);
                      }}
                      memoryId="avatar"
                      userId={user?.id || 'guest'}
                      maxFiles={1}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#23262F] border-[#353945]">
            <CardHeader>
              <CardTitle className="text-[#FCFCFD] flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription className="text-[#777E90]">
                Manage how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#FCFCFD]">Email Notifications</p>
                  <p className="text-sm text-[#777E90]">Receive updates via email</p>
                </div>
                <Switch 
                  checked={preferences.emailNotifications}
                  onCheckedChange={() => togglePreference('emailNotifications')}
                  disabled={loading}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#FCFCFD]">Push Notifications</p>
                  <p className="text-sm text-[#777E90]">Receive notifications in-app</p>
                </div>
                <Switch 
                  checked={preferences.pushNotifications}
                  onCheckedChange={() => togglePreference('pushNotifications')}
                  disabled={loading}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#23262F] border-[#353945]">
            <CardHeader>
              <CardTitle className="text-[#FCFCFD] flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy
              </CardTitle>
              <CardDescription className="text-[#777E90]">
                Manage your privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#FCFCFD]">Profile Visibility</p>
                  <p className="text-sm text-[#777E90]">Make your profile public</p>
                </div>
                <Switch 
                  checked={preferences.profileVisibility}
                  onCheckedChange={() => togglePreference('profileVisibility')}
                  disabled={loading}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#FCFCFD]">Show Card Value</p>
                  <p className="text-sm text-[#777E90]">Display card values on your profile</p>
                </div>
                <Switch 
                  checked={preferences.showCardValue}
                  onCheckedChange={() => togglePreference('showCardValue')}
                  disabled={loading}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#23262F] border-[#353945]">
            <CardHeader>
              <CardTitle className="text-[#FCFCFD] flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Display
              </CardTitle>
              <CardDescription className="text-[#777E90]">
                Customize your interface
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#FCFCFD]">Dark Mode</p>
                  <p className="text-sm text-[#777E90]">Switch between light and dark mode</p>
                </div>
                <Switch 
                  checked={preferences.darkMode}
                  onCheckedChange={() => togglePreference('darkMode')}
                  disabled={loading}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#FCFCFD]">Compact View</p>
                  <p className="text-sm text-[#777E90]">Show more items per page</p>
                </div>
                <Switch 
                  checked={preferences.compactView}
                  onCheckedChange={() => togglePreference('compactView')}
                  disabled={loading}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button 
              variant="outline" 
              className="border-[#353945] text-[#FCFCFD]"
              onClick={fetchUserProfile}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              className="bg-[#3772FF] hover:bg-[#3772FF]/90"
              onClick={handleSaveChanges}
              disabled={loading}
            >
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
