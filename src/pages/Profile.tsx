
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CRDButton, CRDInput } from '@/components/ui/design-system';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LoadingState } from '@/components/common/LoadingState';
import { useCustomAuth } from '@/features/auth/hooks/useCustomAuth';
import { toast } from '@/hooks/use-toast';
import { User, Edit, Settings, Save } from 'lucide-react';

interface ProfileData {
  fullName: string;
  bio: string;
  username: string;
}

const Profile = () => {
  const { user, loading } = useCustomAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Profile data
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [originalData, setOriginalData] = useState({ fullName: '', bio: '' });

  // Load profile data from localStorage
  useEffect(() => {
    if (user?.id) {
      try {
        const existingProfiles = JSON.parse(localStorage.getItem('cardshow_profiles') || '{}');
        const userProfile = existingProfiles[user.id];
        
        if (userProfile) {
          setFullName(userProfile.fullName || '');
          setBio(userProfile.bio || '');
          setOriginalData({ fullName: userProfile.fullName || '', bio: userProfile.bio || '' });
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

    setIsSaving(true);
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
      
      setOriginalData({ fullName, bio });
      setIsEditing(false);
      
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
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setFullName(originalData.fullName);
    setBio(originalData.bio);
    setIsEditing(false);
  };

  if (loading) {
    return <LoadingState message="Loading profile..." fullPage size="lg" />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-crd-darkest flex items-center justify-center">
        <Card className="bg-crd-dark border-crd-mediumGray p-6 max-w-md w-full mx-4">
          <CardContent className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-crd-white">Please sign in to view your profile</h2>
            <Link to="/auth/signin">
              <CRDButton variant="primary" className="w-full">
                Sign In
              </CRDButton>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const displayName = fullName || user.username;
  const hasProfileData = fullName || bio;

  return (
    <div className="min-h-screen bg-crd-darkest">
      <div className="container mx-auto p-6 max-w-4xl">
        {/* Profile Header */}
        <Card className="bg-crd-dark border-crd-mediumGray mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-crd-blue text-crd-white text-2xl">
                    {displayName?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl text-crd-white">{displayName}</CardTitle>
                  <CardDescription className="text-crd-lightGray">@{user.username}</CardDescription>
                  {bio && !isEditing && (
                    <p className="text-crd-lightGray mt-2">{bio}</p>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                {!isEditing ? (
                  <>
                    <CRDButton
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      size="sm"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </CRDButton>
                    <Link to="/account">
                      <CRDButton variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </CRDButton>
                    </Link>
                  </>
                ) : (
                  <div className="flex space-x-2">
                    <CRDButton
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      variant="primary"
                      size="sm"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isSaving ? 'Saving...' : 'Save'}
                    </CRDButton>
                    <CRDButton
                      onClick={handleCancelEdit}
                      disabled={isSaving}
                      variant="ghost"
                      size="sm"
                    >
                      Cancel
                    </CRDButton>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Editable Profile Information */}
        {isEditing && (
          <Card className="bg-crd-dark border-crd-mediumGray mb-6">
            <CardHeader>
              <CardTitle className="text-crd-white flex items-center gap-2">
                <User className="h-5 w-5" />
                Edit Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>
        )}

        {/* Profile Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="bg-crd-dark border-crd-mediumGray">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-crd-white">0</div>
              <div className="text-crd-lightGray">Memories</div>
            </CardContent>
          </Card>
          <Card className="bg-crd-dark border-crd-mediumGray">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-crd-white">0</div>
              <div className="text-crd-lightGray">Followers</div>
            </CardContent>
          </Card>
          <Card className="bg-crd-dark border-crd-mediumGray">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-crd-white">0</div>
              <div className="text-crd-lightGray">Following</div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Content Placeholder */}
        {!hasProfileData && !isEditing && (
          <Card className="bg-crd-dark border-crd-mediumGray">
            <CardContent className="p-12 text-center">
              <User className="h-16 w-16 text-crd-mediumGray mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-crd-white mb-2">Complete Your Profile</h3>
              <p className="text-crd-lightGray mb-6">
                Add your name and bio to make your profile more personal
              </p>
              <CRDButton onClick={() => setIsEditing(true)} variant="primary">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </CRDButton>
            </CardContent>
          </Card>
        )}

        {/* Future content tabs could go here */}
        {hasProfileData && !isEditing && (
          <Card className="bg-crd-dark border-crd-mediumGray">
            <CardContent className="p-12 text-center">
              <h3 className="text-xl font-semibold text-crd-white mb-2">Your Content</h3>
              <p className="text-crd-lightGray">
                Your memories and content will appear here
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Profile;
