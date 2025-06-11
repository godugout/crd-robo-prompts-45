
import { useState } from 'react';

export const useViewerState = (isMobile: boolean) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCustomizePanel, setShowCustomizePanel] = useState(!isMobile);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showGestureHelp, setShowGestureHelp] = useState(false);
  const [showMobileInfo, setShowMobileInfo] = useState(false);
  
  // Mobile-specific state
  const [showStudioPanel, setShowStudioPanel] = useState(false);
  const [showCreateCardPanel, setShowCreateCardPanel] = useState(false);
  const [showFramesPanel, setShowFramesPanel] = useState(false);
  const [showShowcasePanel, setShowShowcasePanel] = useState(false);
  const [rotateMode, setRotateMode] = useState(false);
  const [selectedFrameId, setSelectedFrameId] = useState<string>();
  const [selectedShowcaseLayoutId, setSelectedShowcaseLayoutId] = useState<string>();

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return {
    // State
    isFullscreen,
    showCustomizePanel,
    showExportDialog,
    showGestureHelp,
    showMobileInfo,
    showStudioPanel,
    showCreateCardPanel,
    showFramesPanel,
    showShowcasePanel,
    rotateMode,
    selectedFrameId,
    selectedShowcaseLayoutId,
    
    // Setters
    setIsFullscreen,
    setShowCustomizePanel,
    setShowExportDialog,
    setShowGestureHelp,
    setShowMobileInfo,
    setShowStudioPanel,
    setShowCreateCardPanel,
    setShowFramesPanel,
    setShowShowcasePanel,
    setRotateMode,
    setSelectedFrameId,
    setSelectedShowcaseLayoutId,
    
    // Methods
    toggleFullscreen
  };
};
