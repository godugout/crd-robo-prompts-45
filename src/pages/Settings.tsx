
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Bell, Shield, Palette, Globe } from 'lucide-react';

const Settings = () => {
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
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#FCFCFD]">Push Notifications</p>
                  <p className="text-sm text-[#777E90]">Receive notifications in-app</p>
                </div>
                <Switch />
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
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#FCFCFD]">Show Card Value</p>
                  <p className="text-sm text-[#777E90]">Display card values on your profile</p>
                </div>
                <Switch />
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
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#FCFCFD]">Compact View</p>
                  <p className="text-sm text-[#777E90]">Show more items per page</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button variant="outline" className="border-[#353945] text-[#FCFCFD]">
              Cancel
            </Button>
            <Button className="bg-[#3772FF] hover:bg-[#3772FF]/90">
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
