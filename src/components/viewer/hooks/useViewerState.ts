
import { useState } from 'react';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';
import { ENVIRONMENT_SCENES, LIGHTING_PRESETS } from '../constants';

export const useViewerState = () => {
  // State
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isFlipped, setIsFlipped] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [showEffects, setShowEffects] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showCustomizePanel, setShowCustomizePanel] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isHoveringControls, setIsHoveringControls] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showGestureHelp, setShowGestureHelp] = useState(false);
  const [showMobileInfo, setShowMobileInfo] = useState(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string>();

  // Advanced settings
  const [selectedScene, setSelectedScene] = useState<EnvironmentScene>(ENVIRONMENT_SCENES[0]);
  const [selectedLighting, setSelectedLighting] = useState<LightingPreset>(LIGHTING_PRESETS[0]);
  const [overallBrightness, setOverallBrightness] = useState([100]);
  const [interactiveLighting, setInteractiveLighting] = useState(true);
  
  // Material properties
  const [materialSettings, setMaterialSettings] = useState<MaterialSettings>({
    roughness: 0.40,
    metalness: 0.45,
    clearcoat: 0.60,
    reflectivity: 0.40
  });

  return {
    // Basic state
    isFullscreen, setIsFullscreen,
    rotation, setRotation,
    isDragging, setIsDragging,
    dragStart, setDragStart,
    zoom, setZoom,
    isFlipped, setIsFlipped,
    autoRotate, setAutoRotate,
    showEffects, setShowEffects,
    mousePosition, setMousePosition,
    showCustomizePanel, setShowCustomizePanel,
    isHovering, setIsHovering,
    isHoveringControls, setIsHoveringControls,
    showExportDialog, setShowExportDialog,
    showGestureHelp, setShowGestureHelp,
    showMobileInfo, setShowMobileInfo,
    selectedPresetId, setSelectedPresetId,

    // Advanced settings
    selectedScene, setSelectedScene,
    selectedLighting, setSelectedLighting,
    overallBrightness, setOverallBrightness,
    interactiveLighting, setInteractiveLighting,
    materialSettings, setMaterialSettings
  };
};
