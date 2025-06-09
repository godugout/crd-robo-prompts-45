
import { useState } from 'react';
import { toast } from 'sonner';
import type { CardData } from '@/hooks/useCardEditor';

export const useStudioProject = () => {
  const [projectName, setProjectName] = useState('Untitled Studio Project');
  const [isExporting, setIsExporting] = useState(false);

  const handleSaveProject = async (
    cardEditor: any,
    currentPhoto: string,
    effectLayers: any[],
    studioState: any,
    advanced3DEffects: any,
    selectedTemplate: any
  ) => {
    const success = await cardEditor.saveCard();
    if (success) {
      const projectData = {
        name: projectName,
        cardData: cardEditor.cardData,
        currentPhoto,
        effectLayers,
        studioState,
        advanced3DEffects,
        template: selectedTemplate,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(`studio-project-${Date.now()}`, JSON.stringify(projectData));
      toast.success('Advanced studio project saved!');
    }
  };

  const handleExport = async (
    exportRef: React.RefObject<HTMLDivElement>,
    cardTitle: string
  ) => {
    if (!exportRef.current) {
      toast.error('Export renderer not ready');
      return;
    }
    
    setIsExporting(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      
      const canvas = await html2canvas(exportRef.current, {
        backgroundColor: 'transparent',
        scale: 3,
        useCORS: true,
        width: 750,
        height: 1050,
        windowWidth: 750,
        windowHeight: 1050
      });
      
      const link = document.createElement('a');
      link.download = `${cardTitle.replace(/\s+/g, '_')}_ultra_hd.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
      
      toast.success('🎉 Ultra HD card exported!');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  return {
    projectName,
    isExporting,
    setProjectName,
    handleSaveProject,
    handleExport
  };
};
