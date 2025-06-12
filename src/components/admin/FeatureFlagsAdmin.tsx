
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import { toast } from 'sonner';

export const FeatureFlagsAdmin: React.FC = () => {
  const { featureFlags, updateFeatureFlag, isLoading } = useFeatureFlags();

  const handleToggle = (flag: keyof typeof featureFlags, checked: boolean) => {
    updateFeatureFlag(flag, checked);
    toast.success(`${flag} ${checked ? 'enabled' : 'disabled'}`);
  };

  if (isLoading) {
    return <div>Loading feature flags...</div>;
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Feature Flags</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="oak-features" className="text-sm font-medium">
            Oakland A's Features
          </Label>
          <Switch
            id="oak-features"
            checked={featureFlags.OAK_FEATURES}
            onCheckedChange={(checked) => handleToggle('OAK_FEATURES', checked)}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Controls the visibility of Oakland A's memory creator, navigation links, and related features.
        </p>
      </CardContent>
    </Card>
  );
};
