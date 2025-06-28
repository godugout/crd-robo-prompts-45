
import React, { useState, useEffect } from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Badge } from '@/components/ui/badge';
import { ProcessedPSDLayer } from '@/services/psdProcessor/psdProcessingService';
import { analyzeLayerContent } from '@/services/psdProcessor/contentAnalysisService';
import { ExternalLink, Type, User, Building } from 'lucide-react';

interface LayerHoverCardProps {
  layer: ProcessedPSDLayer;
  children: React.ReactNode;
}

export const LayerHoverCard: React.FC<LayerHoverCardProps> = ({ layer, children }) => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const analyzeContent = async () => {
      if (!analysis) {
        setLoading(true);
        try {
          const result = await analyzeLayerContent(layer);
          setAnalysis(result);
        } catch (error) {
          console.warn('Content analysis failed:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    analyzeContent();
  }, [layer, analysis]);

  const getTypeIcon = () => {
    switch (analysis?.type) {
      case 'player': return <User className="w-4 h-4" />;
      case 'logo': return <Building className="w-4 h-4" />;
      case 'text': return <Type className="w-4 h-4" />;
      default: return null;
    }
  };

  const getTypeColor = () => {
    switch (analysis?.type) {
      case 'player': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'logo': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'text': return 'bg-green-500/20 text-green-400 border-green-500/50';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    }
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent className="w-80 bg-[#1a1f2e] border-slate-700">
        <div className="space-y-3">
          {/* Layer Header */}
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-white truncate">
              {layer.name}
            </h4>
            <Badge variant="outline" className={`text-xs ${getTypeColor()}`}>
              <div className="flex items-center gap-1">
                {getTypeIcon()}
                {analysis?.type || 'unknown'}
              </div>
            </Badge>
          </div>

          {/* Layer Properties */}
          <div className="space-y-2 text-xs text-slate-400">
            <div className="flex justify-between">
              <span>Type:</span>
              <span className="text-slate-300">{layer.semanticType || layer.type}</span>
            </div>
            <div className="flex justify-between">
              <span>Opacity:</span>
              <span className="text-slate-300">{Math.round(layer.opacity * 100)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Size:</span>
              <span className="text-slate-300">
                {layer.bounds.right - layer.bounds.left} × {layer.bounds.bottom - layer.bounds.top}px
              </span>
            </div>
          </div>

          {/* Font Information */}
          {analysis?.fontFamily && (
            <div className="p-2 bg-slate-800/50 rounded border border-slate-600">
              <div className="flex items-center gap-2 mb-1">
                <Type className="w-3 h-3 text-green-400" />
                <span className="text-xs font-medium text-green-400">Font Detected</span>
              </div>
              <p className="text-xs text-slate-300">{analysis.fontFamily}</p>
            </div>
          )}

          {/* Wikipedia Information */}
          {analysis?.wikipediaInfo && (
            <div className="p-2 bg-slate-800/50 rounded border border-slate-600">
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-xs font-medium text-white">{analysis.wikipediaInfo.title}</h5>
                <a
                  href={analysis.wikipediaInfo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-crd-blue hover:text-crd-blue/80 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-xs text-slate-300 line-clamp-3">
                {analysis.wikipediaInfo.summary}
              </p>
            </div>
          )}

          {/* Subject Information */}
          {analysis?.subject && !analysis?.wikipediaInfo && (
            <div className="p-2 bg-slate-800/50 rounded border border-slate-600">
              <div className="flex items-center gap-2 mb-1">
                {getTypeIcon()}
                <span className="text-xs font-medium text-slate-300">Detected Subject</span>
              </div>
              <p className="text-xs text-slate-400">{analysis.subject}</p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="p-2 bg-slate-800/50 rounded border border-slate-600">
              <p className="text-xs text-slate-400">Analyzing content...</p>
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
