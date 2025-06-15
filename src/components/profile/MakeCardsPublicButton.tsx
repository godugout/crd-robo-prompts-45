
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Globe, Loader2 } from 'lucide-react';
import { makeUserCardsPublic } from '@/utils/cardUtils';
import { useAuth } from '@/contexts/AuthContext';

export const MakeCardsPublicButton: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleMakePublic = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    await makeUserCardsPublic(user.id);
    setIsLoading(false);
  };

  if (!user) return null;

  return (
    <Button
      onClick={handleMakePublic}
      disabled={isLoading}
      variant="outline"
      className="flex items-center gap-2"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Globe className="w-4 h-4" />
      )}
      Make Cards Public
    </Button>
  );
};
