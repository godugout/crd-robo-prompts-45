
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useDraftManager } from '@/hooks/useDraftManager';
import type { CardData } from '@/hooks/useCardEditor';

export const useStudioProject = () => {
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get('draft');
  
  const { createDraft, updateDraft, loadDraft } = useDraftManager();
  const [projectName, setProjectName] = useState('Untitled Studio Project');
  const [isExporting, setIsExporting] = useState(false);
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(draftId);

  // Load draft data if coming from draft link
  useEffect(() => {
    if (draftId) {
      const draft = loadDraft(draftId);
      if (draft) {
        setProjectName(draft.metadata.name);
        setCurrentDraftId(draftId);
        // Additional loading logic can be added here
      }
    }
  }, [draftId, loadDraft]);

  const handleSaveProject = async (
    cardEditor: any,
    currentPhoto: string,
    effectLayers: any[],
    studioState: any,
    advanced3DEffects: any,
    selectedTemplate: any
  ) => {
    try {
      const projectData = {
        cardData: cardEditor.cardData,
        currentPhoto,
        effectLayers,
        studioState,
        advanced3DEffects,
        template: selectedTemplate,
        timestamp: new Date().toISOString()
      };

      if (currentDraftId) {
        // Update existing draft
        const success = updateDraft(currentDraftId, { name: projectName }, projectData);
        if (success) {
          toast.success('Studio project updated!');
        } else {
          toast.error('Failed to update project');
        }
      } else {
        // Create new draft
        const newDraftId = createDraft(
          projectName,
          'studio',
          'Advanced Studio',
          projectData
        );
        setCurrentDraftId(newDraftId);
      }

      // Also save to card editor if requested
      const success = await cardEditor.saveCard();
      if (!success) {
        toast.error('Failed to save card data');
      }
    } catch (error) {
      console.error('Error saving studio project:', error);
      toast.error('Failed to save project');
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
    currentDraftId,
    setProjectName,
    handleSaveProject,
    handleExport
  };
};
