
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase, getAppId } from '@/integrations/supabase/client';

export interface AppSettings {
  theme?: string;
  features?: string[];
  config?: Record<string, any>;
}

export const useAppSettings = () => {
  const fetchSettings = async () => {
    const appId = await getAppId();
    if (!appId) throw new Error('Could not determine app ID');

    const { data, error } = await supabase
      .from('app_settings')
      .select('settings')
      .eq('app_id', appId)
      .single();

    if (error) throw error;
    return data?.settings as AppSettings;
  };

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    const appId = await getAppId();
    if (!appId) throw new Error('Could not determine app ID');

    const { data, error } = await supabase
      .from('app_settings')
      .upsert({
        app_id: appId,
        settings: newSettings
      })
      .select()
      .single();

    if (error) throw error;
    return data.settings as AppSettings;
  };

  const { data: settings, isLoading } = useQuery({
    queryKey: ['app-settings'],
    queryFn: fetchSettings
  });

  const { mutate: saveSettings } = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      // Invalidate and refetch app settings
      queryClient.invalidateQueries({ queryKey: ['app-settings'] });
    }
  });

  return {
    settings,
    isLoading,
    saveSettings
  };
};
