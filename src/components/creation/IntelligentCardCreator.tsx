
import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { ArrowLeft, Sparkles, Wand2, Zap, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { UnifiedCardRenderer } from './UnifiedCardRenderer';
import { useCardCreation } from '@/hooks/useCardCreation';
import { imageAnalyzer, ImageAnalysis } from '@/services/ai/ImageAnalyzer';
import { userBehaviorLearning } from '@/services/ai/UserBehaviorLearning';
import { toast } from 'sonner';
import type { UnifiedCardData } from '@/types/cardCreation';

interface IntelligentCardCreatorProps {
  onBack?: () => void;
}

export const IntelligentCardCreator: React.FC<IntelligentCardCreatorProps> = ({ onBack }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ImageAnalysis | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [showPredictions, setShowPredictions] = useState(false);
  const [gestureDirection, setGestureDirection] = useState<'left' | 'right' | null>(null);
  
  const { state, uploadImage, updateCardData, nextStep } = useCardCreation();

  // Load user preferences on mount
  useEffect(() => {
    userBehaviorLearning.loadPreferences();
  }, []);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      // Track user action
      userBehaviorLearning.trackAction('upload', { fileName: file.name, fileSize: file.size });
      
      // Start upload
      uploadImage(file);
      
      // Begin AI analysis
      setIsAnalyzing(true);
      setAnalysisProgress(0);
      
      try {
        // Simulate progress for better UX
        const progressInterval = setInterval(() => {
          setAnalysisProgress(prev => Math.min(95, prev + Math.random() * 15));
        }, 200);

        const imageAnalysis = await imageAnalyzer.analyzeImage(file);
        
        clearInterval(progressInterval);
        setAnalysisProgress(100);
        setAnalysis(imageAnalysis);
        
        // Get AI recommendations
        const recommendations = userBehaviorLearning.getPredictiveRecommendations(imageAnalysis);
        
        // Auto-apply recommendations
        setTimeout(() => {
          updateCardData({
            frame: recommendations.suggestedFrame,
            effects: recommendations.suggestedEffects,
            title: `${imageAnalysis.category.charAt(0).toUpperCase() + imageAnalysis.category.slice(1)} Card`,
            description: `AI-enhanced ${imageAnalysis.category} card with ${Math.round(imageAnalysis.confidence * 100)}% confidence`
          });
          
          setShowPredictions(true);
          toast.success(`🧠 AI applied ${Math.round(recommendations.confidence * 100)}% confident recommendations!`);
        }, 1000);
        
      } catch (error) {
        console.error('AI analysis failed:', error);
        toast.error('AI analysis failed, but your image looks great!');
      } finally {
        setIsAnalyzing(false);
      }
    }
  }, [uploadImage, updateCardData]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: 1,
    disabled: isAnalyzing
  });

  const handleGesture = useCallback((direction: 'left' | 'right') => {
    if (!analysis) return;
    
    setGestureDirection(direction);
    userBehaviorLearning.trackAction('frame_select', { direction, currentFrame: state.cardData.frame });
    
    // Cycle through frame suggestions based on gesture
    const frames = ['classic-sports', 'holographic-modern', 'vintage-ornate', 'chrome-edition'];
    const currentIndex = frames.indexOf(state.cardData.frame);
    const nextIndex = direction === 'right' 
      ? (currentIndex + 1) % frames.length
      : (currentIndex - 1 + frames.length) % frames.length;
    
    updateCardData({ frame: frames[nextIndex] });
    
    // Trigger haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    setTimeout(() => setGestureDirection(null), 300);
  }, [analysis, state.cardData.frame, updateCardData]);

  const renderUploadArea = () => (
    <Card
      {...getRootProps()}
      className={`
        border-2 border-dashed transition-all duration-500 cursor-pointer
        ${isDragActive ? 'border-crd-green bg-crd-green/10 scale-105' : 'border-gray-600 hover:border-crd-green/50'}
        ${isAnalyzing ? 'opacity-50 pointer-events-none' : ''}
      `}
    >
      <div className="p-12 text-center space-y-6">
        <input {...getInputProps()} />
        
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-crd-green flex items-center justify-center">
          {isAnalyzing ? (
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Brain className={`w-10 h-10 text-white ${isDragActive ? 'animate-pulse' : ''}`} />
          )}
        </div>

        <div>
          <h3 className="text-2xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-crd-green bg-clip-text text-transparent">
            {isAnalyzing ? 'AI Analyzing Your Image...' : 'AI-Powered Card Creation'}
          </h3>
          <p className="text-gray-400 mb-4">
            Drop your image and watch AI magic happen in real-time
          </p>
          
          {isAnalyzing && (
            <div className="space-y-2">
              <Progress value={analysisProgress} className="w-full max-w-xs mx-auto" />
              <p className="text-sm text-gray-500">
                Analyzing composition, colors, and optimal enhancements...
              </p>
            </div>
          )}
        </div>

        {!isAnalyzing && (
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
              <Sparkles className="w-3 h-3 mr-1" />
              Smart Templates
            </Badge>
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
              <Wand2 className="w-3 h-3 mr-1" />
              Auto Enhancement
            </Badge>
            <Badge variant="secondary" className="bg-green-500/20 text-green-300">
              <Zap className="w-3 h-3 mr-1" />
              Gesture Control
            </Badge>
          </div>
        )}
      </div>
    </Card>
  );

  const renderIntelligentPreview = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* AI Insights Panel */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Brain className="w-6 h-6 text-crd-green" />
            AI Analysis Complete
          </h2>
          <p className="text-gray-400">Swipe the card left/right to try different styles</p>
        </div>

        {analysis && (
          <Card className="p-6 bg-gray-800/50 border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              Smart Insights
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Category Detected:</span>
                <Badge className="bg-crd-green/20 text-crd-green">
                  {analysis.category} ({Math.round(analysis.confidence * 100)}%)
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Composition Score:</span>
                <span className="text-white font-medium">
                  {Math.round(analysis.composition.rule_of_thirds_score * 100)}/100
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Focal Points:</span>
                <span className="text-white font-medium">{analysis.focalPoints.length} detected</span>
              </div>
              
              <div>
                <span className="text-gray-300 block mb-2">Dominant Colors:</span>
                <div className="flex gap-2">
                  {analysis.colorAnalysis.dominant_colors.slice(0, 4).map((color, i) => (
                    <div 
                      key={i}
                      className="w-6 h-6 rounded-full border border-gray-600"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {analysis.suggestedEnhancements.crop_suggestion && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                  <p className="text-yellow-300 text-sm flex items-center gap-1">
                    <Wand2 className="w-4 h-4" />
                    AI suggests optimal cropping for better composition
                  </p>
                </div>
              )}
            </div>
          </Card>
        )}

        <div className="flex gap-4">
          <Button
            onClick={() => handleGesture('left')}
            variant="outline"
            className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            ← Previous Style
          </Button>
          <Button
            onClick={() => handleGesture('right')}
            variant="outline"
            className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Next Style →
          </Button>
        </div>

        <Button
          onClick={nextStep}
          className="w-full bg-gradient-to-r from-purple-500 to-crd-green hover:from-purple-600 hover:to-crd-green/90 text-white font-semibold"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Continue with AI Suggestions
        </Button>
      </div>

      {/* Live Preview */}
      <div className={`
        transition-transform duration-300 
        ${gestureDirection === 'left' ? '-translate-x-4' : gestureDirection === 'right' ? 'translate-x-4' : ''}
      `}>
        {state.uploadedImage && (
          <UnifiedCardRenderer
            cardData={state.cardData}
            imageUrl={state.uploadedImage}
            width={350}
            height={490}
            mode="3d"
            className="shadow-2xl"
          />
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-crd-darkest via-[#0a0a0b] to-[#131316]">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button
                onClick={onBack}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-crd-green" />
                Intelligent Card Creator
              </h1>
              <p className="text-sm text-gray-400">AI-powered creation with adaptive learning</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {!state.uploadedImage ? renderUploadArea() : renderIntelligentPreview()}
      </div>
    </div>
  );
};
