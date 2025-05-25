
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CRDButton, CRDInput } from '@/components/ui/design-system';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { User, Shield, Bell, Palette } from 'lucide-react';
import { useCustomAuth } from '@/features/auth/hooks/useCustomAuth';
import { toast } from '@/hooks/use-toast';

interface ProfileData {
  fullName: string;
  bio: string;
  username: string;
}

const AccountSettings = () => {
  const { user, signOut } = useCustomAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Profile settings
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  
  // Privacy settings
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [showActivity, setShowActivity] = useState(true);
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  // Load profile data from localStorage
  useEffect(() => {
    if (user?.id) {
      try {
        const existingProfiles = JSON.parse(localStorage.getItem('cardshow_profiles') || '{}');
        const userProfile = existingProfiles[user.id];
        
        if (userProfile) {
          setFullName(userProfile.fullName || '');
          setBio(userProfile.bio || '');
          console.log('🔧 Loaded profile from localStorage:', userProfile);
        }
      } catch (error) {
        console.error('🔧 Error loading profile:', error);
      }
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be signed in to save profile changes',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const profileData: ProfileData = {
        fullName,
        bio,
        username: user.username
      };

      // Save to localStorage
      const existingProfiles = JSON.parse(localStorage.getItem('cardshow_profiles') || '{}');
      existingProfiles[user.id] = profileData;
      localStorage.setItem('cardshow_profiles', JSON.stringify(existingProfiles));
      
      console.log('🔧 Profile saved:', profileData);
      
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been saved successfully',
      });
    } catch (error) {
      console.error('🔧 Error saving profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to save profile changes',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    signOut();
    toast({
      title: 'Signed Out',
      description: 'You have been signed out successfully',
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-crd-darkest flex items-center justify-center">
        <Card className="bg-crd-dark border-crd-mediumGray p-6">
          <p className="text-crd-white">Please sign in to access account settings.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-crd-darkest">
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-crd-white">Account Settings</h1>
          <p className="text-crd-lightGray">Manage your account preferences and privacy settings</p>
        </div>

        <div className="grid gap-6">
          {/* Profile Information */}
          <Card className="bg-crd-dark border-crd-mediumGray">
            <CardHeader>
              <CardTitle className="text-crd-white flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription className="text-crd-lightGray">
                Update your personal information and bio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-crd-white">Username</Label>
                <CRDInput
                  id="username"
                  variant="crd"
                  value={user.username}
                  disabled
                  className="opacity-50"
                />
                <p className="text-xs text-crd-lightGray">Username cannot be changed</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-crd-white">Full Name</Label>
                <CRDInput
                  id="fullName"
                  variant="crd"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-crd-white">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="bg-crd-dark border-crd-mediumGray text-crd-white placeholder:text-crd-lightGray focus-visible:ring-crd-blue focus-visible:border-crd-blue min-h-[100px] resize-none"
                  maxLength={200}
                />
                <p className="text-xs text-crd-lightGray">{bio.length}/200 characters</p>
              </div>

              <CRDButton
                onClick={handleSaveProfile}
                disabled={isLoading}
                variant="primary"
              >
                {isLoading ? 'Saving...' : 'Save Profile'}
              </CRDButton>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card className="bg-crd-dark border-crd-mediumGray">
            <CardHeader>
              <CardTitle className="text-crd-white flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy Settings
              </CardTitle>
              <CardDescription className="text-crd-lightGray">
                Control who can see your information and activity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-crd-white">Public Profile</p>
                  <p className="text-sm text-crd-lightGray">Make your profile visible to other users</p>
                </div>
                <Switch 
                  checked={profileVisibility}
                  onCheckedChange={setProfileVisibility}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-crd-white">Show Activity</p>
                  <p className="text-sm text-crd-lightGray">Let others see your recent card activity</p>
                </div>
                <Switch 
                  checked={showActivity}
                  onCheckedChange={setShowActivity}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="bg-crd-dark border-crd-mediumGray">
            <CardHeader>
              <CardTitle className="text-crd-white flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription className="text-crd-lightGray">
                Choose how you want to be notified
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-crd-white">Email Notifications</p>
                  <p className="text-sm text-crd-lightGray">Receive updates via email</p>
                </div>
                <Switch 
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-crd-white">Push Notifications</p>
                  <p className="text-sm text-crd-lightGray">Receive in-app notifications</p>
                </div>
                <Switch 
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card className="bg-crd-dark border-crd-mediumGray">
            <CardHeader>
              <CardTitle className="text-crd-white">Account Actions</CardTitle>
              <CardDescription className="text-crd-lightGray">
                Manage your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CRDButton
                onClick={handleSignOut}
                variant="outline"
                className="text-crd-lightGray hover:text-crd-white"
              >
                Sign Out
              </CRDButton>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
