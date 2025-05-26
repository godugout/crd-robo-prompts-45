
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  X, 
  Maximize2, 
  Minimize2, 
  Share2, 
  Download, 
  RotateCw,
  ZoomIn,
  ZoomOut,
  Move,
  Sparkles,
  Eye,
  EyeOff
} from 'lucide-react';
import type { CardData } from '@/hooks/useCardEditor';

// Extended interface for viewer-specific props
interface CardEffect {
  type: 'holographic' | 'refractor' | 'foil' | 'prizm';
  intensity: number;
  color?: string;
}

interface ImmersiveCardViewerProps {
  card: CardData;
  isOpen?: boolean;
  onClose?: () => void;
  onShare?: (card: CardData) => void;
  onDownload?: (card: CardData) => void;
  allowRotation?: boolean;
  showStats?: boolean;
  ambient?: boolean;
}

export const ImmersiveCardViewer: React.FC<ImmersiveCardViewerProps> = ({
  card,
  isOpen = true,
  onClose,
  onShare,
  onDownload,
  allowRotation = true,
  showStats = true,
  ambient = true
}) => {
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
  
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  // Auto-rotation effect
  useEffect(() => {
    if (autoRotate && !isDragging) {
      const animate = () => {
        setRotation(prev => ({
          x: Math.sin(Date.now() * 0.0005) * 10,
          y: prev.y + 0.5
        }));
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [autoRotate, isDragging]);

  // Handle mouse movement for effects
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMousePosition({ x, y });
      
      if (allowRotation && !autoRotate) {
        setRotation({
          x: (y - 0.5) * 20,
          y: (x - 0.5) * -20
        });
      }
    }
  }, [isDragging, allowRotation, autoRotate]);

  // Handle drag start
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if (allowRotation) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - rotation.y, y: e.clientY - rotation.x });
      setAutoRotate(false);
    }
  }, [rotation, allowRotation]);

  // Handle drag
  const handleDrag = useCallback((e: React.MouseEvent) => {
    if (isDragging && allowRotation) {
      setRotation({
        x: e.clientY - dragStart.y,
        y: e.clientX - dragStart.x
      });
    }
  }, [isDragging, dragStart, allowRotation]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Reset view
  const handleReset = useCallback(() => {
    setRotation({ x: 0, y: 0 });
    setZoom(1);
    setIsFlipped(false);
    setAutoRotate(false);
  }, []);

  // Handle zoom
  const handleZoom = useCallback((delta: number) => {
    setZoom(prev => Math.max(0.5, Math.min(2, prev + delta)));
  }, []);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Get frame-specific styles based on template
  const getFrameStyles = () => {
    const baseStyles: React.CSSProperties = {
      backgroundColor: '#ffffff',
      borderColor: '#e5e7eb'
    };

    switch (card.template_id) {
      case 'neon':
        return {
          ...baseStyles,
          boxShadow: '0 0 40px #c026d3',
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          border: '2px solid #c026d3'
        };
      case 'vintage':
        return {
          ...baseStyles,
          boxShadow: '0 10px 20px rgba(139,69,19,0.3)',
          background: 'linear-gradient(135deg, #f5e6d3 0%, #e6d7c3 100%)',
          border: '3px solid #8b4513'
        };
      case 'classic':
        return {
          ...baseStyles,
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          background: '#ffffff',
          border: '2px solid #d1d5db'
        };
      case 'modern':
        return {
          ...baseStyles,
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          border: '1px solid #cbd5e1'
        };
      default:
        return baseStyles;
    }
  };

  // Apply effects based on mouse position and template
  const getEffectStyles = useCallback(() => {
    const styles: React.CSSProperties = {};
    
    if (showEffects) {
      const hueRotate = mousePosition.x * 360;
      const shimmerX = mousePosition.x * 100;
      const shimmerY = mousePosition.y * 100;
      
      if (card.template_id === 'neon') {
        styles.filter = `hue-rotate(${hueRotate}deg) brightness(1.2) saturate(1.3)`;
        styles.background = `radial-gradient(circle at ${shimmerX}% ${shimmerY}%, 
          rgba(192,38,211,0.3), transparent 40%)`;
      } else if (card.template_id === 'vintage') {
        styles.filter = `sepia(0.3) brightness(1.1)`;
      }
    }
    
    return styles;
  }, [card.template_id, mousePosition, showEffects]);

  if (!isOpen) return null;

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center ${
        isFullscreen ? 'p-0' : 'p-8'
      }`}
      onMouseMove={handleMouseMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
    >
      {/* Ambient Background Effect */}
      {ambient && (
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
              #4f46e5 0%, transparent 50%)`
          }}
        />
      )}

      {/* Controls */}
      <div className="absolute top-4 right-4 flex space-x-2">
        <button
          onClick={() => setShowEffects(!showEffects)}
          className="p-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg backdrop-blur transition-colors"
          title={showEffects ? "Hide Effects" : "Show Effects"}
        >
          {showEffects ? <Eye className="w-5 h-5 text-white" /> : <EyeOff className="w-5 h-5 text-white" />}
        </button>
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`p-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg backdrop-blur transition-colors ${
            autoRotate ? 'bg-opacity-30' : ''
          }`}
          title="Auto Rotate"
        >
          <RotateCw className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={handleReset}
          className="p-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg backdrop-blur transition-colors"
          title="Reset View"
        >
          <Move className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={() => handleZoom(0.1)}
          className="p-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg backdrop-blur transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={() => handleZoom(-0.1)}
          className="p-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg backdrop-blur transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={toggleFullscreen}
          className="p-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg backdrop-blur transition-colors"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 className="w-5 h-5 text-white" /> : <Maximize2 className="w-5 h-5 text-white" />}
        </button>
        {onShare && (
          <button
            onClick={() => onShare(card)}
            className="p-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg backdrop-blur transition-colors"
            title="Share"
          >
            <Share2 className="w-5 h-5 text-white" />
          </button>
        )}
        {onDownload && (
          <button
            onClick={() => onDownload(card)}
            className="p-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg backdrop-blur transition-colors"
            title="Download"
          >
            <Download className="w-5 h-5 text-white" />
          </button>
        )}
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg backdrop-blur transition-colors"
            title="Close"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        )}
      </div>

      {/* Card Container */}
      <div 
        className={`relative ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{
          transform: `scale(${zoom})`,
          transition: isDragging ? 'none' : 'transform 0.3s ease'
        }}
        onMouseDown={handleDragStart}
        onMouseMove={handleDrag}
      >
        {/* 3D Card */}
        <div
          ref={cardRef}
          className="relative"
          style={{
            width: '400px',
            height: '560px',
            transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transformStyle: 'preserve-3d',
            transition: isDragging ? 'none' : 'transform 0.1s ease'
          }}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* Front of Card */}
          <div
            className="absolute inset-0 rounded-xl overflow-hidden backface-hidden"
            style={{
              ...getFrameStyles(),
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              backfaceVisibility: 'hidden'
            }}
          >
            {/* Background Layer */}
            <div className="absolute inset-0" style={getFrameStyles()} />
            
            {/* Effects Layer */}
            <div className="absolute inset-0 pointer-events-none" style={getEffectStyles()} />
            
            {/* Card Content */}
            <div className="relative h-full p-6 flex flex-col">
              {/* Image Section */}
              {card.image_url && (
                <div className="flex-1 mb-6 relative overflow-hidden rounded-lg">
                  <img 
                    src={card.image_url} 
                    alt={card.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Image overlay effects */}
                  {showEffects && (
                    <div className="absolute inset-0 mix-blend-overlay">
                      <div className="w-full h-full bg-gradient-to-br from-transparent via-white to-transparent opacity-20" />
                    </div>
                  )}
                </div>
              )}
              
              {/* Details Section */}
              <div className={`mt-auto p-4 rounded-lg ${
                card.template_id === 'neon'
                  ? 'bg-black bg-opacity-80'
                  : 'bg-white bg-opacity-90'
              }`}>
                <h2 className={`text-2xl font-bold mb-1 ${
                  card.template_id === 'neon'
                    ? 'text-white'
                    : 'text-gray-900'
                }`}>
                  {card.title}
                </h2>
                {card.description && (
                  <p className={`text-lg ${
                    card.template_id === 'neon'
                      ? 'text-gray-300'
                      : 'text-gray-600'
                  }`}>
                    {card.description}
                  </p>
                )}
                {card.series && (
                  <p className={`text-sm ${
                    card.template_id === 'neon'
                      ? 'text-gray-400'
                      : 'text-gray-500'
                  }`}>
                    Series: {card.series}
                  </p>
                )}
                <div className="flex items-center justify-between mt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    card.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-800' :
                    card.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
                    card.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                    card.rarity === 'uncommon' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {card.rarity}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Back of Card */}
          <div
            className="absolute inset-0 rounded-xl overflow-hidden backface-hidden"
            style={{
              ...getFrameStyles(),
              transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(-180deg)',
              backfaceVisibility: 'hidden'
            }}
          >
            <div className="relative h-full p-6 flex flex-col">
              <h3 className={`text-xl font-bold mb-4 ${
                card.template_id === 'neon'
                  ? 'text-white'
                  : 'text-gray-900'
              }`}>
                Card Details
              </h3>
              
              <div className="space-y-3 mb-4">
                <div className={`flex justify-between p-2 rounded ${
                  card.template_id === 'neon'
                    ? 'bg-gray-800'
                    : 'bg-gray-100'
                }`}>
                  <span className={`text-sm ${
                    card.template_id === 'neon'
                      ? 'text-gray-300'
                      : 'text-gray-600'
                  }`}>Type:</span>
                  <span className={`font-medium ${
                    card.template_id === 'neon'
                      ? 'text-white'
                      : 'text-gray-900'
                  }`}>{card.type || 'Character'}</span>
                </div>
                
                <div className={`flex justify-between p-2 rounded ${
                  card.template_id === 'neon'
                    ? 'bg-gray-800'
                    : 'bg-gray-100'
                }`}>
                  <span className={`text-sm ${
                    card.template_id === 'neon'
                      ? 'text-gray-300'
                      : 'text-gray-600'
                  }`}>Rarity:</span>
                  <span className={`font-medium ${
                    card.template_id === 'neon'
                      ? 'text-white'
                      : 'text-gray-900'
                  }`}>{card.rarity}</span>
                </div>

                {card.tags.length > 0 && (
                  <div className={`p-2 rounded ${
                    card.template_id === 'neon'
                      ? 'bg-gray-800'
                      : 'bg-gray-100'
                  }`}>
                    <span className={`text-sm block mb-1 ${
                      card.template_id === 'neon'
                        ? 'text-gray-300'
                        : 'text-gray-600'
                    }`}>Tags:</span>
                    <div className="flex flex-wrap gap-1">
                      {card.tags.map((tag, index) => (
                        <span
                          key={index}
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            card.template_id === 'neon'
                              ? 'bg-gray-700 text-gray-200'
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {card.description && (
                <p className={`text-sm mt-auto ${
                  card.template_id === 'neon'
                    ? 'text-gray-300'
                    : 'text-gray-600'
                }`}>
                  {card.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      {showStats && !isFlipped && (
        <div className="absolute bottom-4 left-4 right-4 max-w-2xl mx-auto">
          <div className="bg-white bg-opacity-10 backdrop-blur rounded-lg p-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex space-x-4 text-sm">
                <span>Click card to flip</span>
                <span>•</span>
                <span>Drag to rotate manually</span>
                <span>•</span>
                <span>Move mouse for effects</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm">
                  Template: {card.template_id || 'default'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
