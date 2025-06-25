
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { EnhancedCardCreator } from '@/components/cards/EnhancedCardCreator';

const CardsEnhanced: React.FC = () => {
  const [searchParams] = useSearchParams();
  
  // Extract customization parameters
  const themeParam = searchParams.get('theme') || 'default';
  const primaryColor = searchParams.get('color') || '#00ff88';
  const imageUrl = searchParams.get('image');
  const title = searchParams.get('title');
  const mode = searchParams.get('mode') || 'full';
  
  // Validate theme to ensure it matches expected types
  const theme = ['default', 'dark', 'light'].includes(themeParam) ? themeParam : 'default';
  
  console.log('CardsEnhanced params:', { theme, primaryColor, imageUrl, title, mode });

  return (
    <div className="min-h-screen" style={{ 
      '--primary-color': primaryColor,
      backgroundColor: theme === 'dark' ? '#141416' : theme === 'light' ? '#ffffff' : '#141416'
    } as React.CSSProperties}>
      <EnhancedCardCreator 
        initialImage={imageUrl}
        initialTitle={title}
        theme={theme}
        primaryColor={primaryColor}
        mode={mode as 'full' | 'embedded' | 'compact'}
      />
    </div>
  );
};

export default CardsEnhanced;
