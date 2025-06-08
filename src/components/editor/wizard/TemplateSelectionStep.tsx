import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import type { TemplateConfig } from './wizardConfig';

interface TemplateSelectionStepProps {
  templates: TemplateConfig[];
  selectedTemplate: TemplateConfig | null;
  onTemplateSelect: (template: TemplateConfig) => void;
}

export const TemplateSelectionStep = ({ templates, selectedTemplate, onTemplateSelect }: TemplateSelectionStepProps) => {
  const getTemplatePreviewGradient = (templateId: string) => {
    const gradients: Record<string, string> = {
      'tcg-classic': 'from-blue-600 via-blue-500 to-yellow-400',
      'sports-modern': 'from-red-600 via-red-500 to-orange-400',
      'school-academic': 'from-green-600 via-green-500 to-yellow-400',
      'organization-corporate': 'from-blue-700 via-indigo-600 to-purple-500',
      'friends-social': 'from-pink-500 via-purple-500 to-cyan-400',
      'vintage-retro': 'from-amber-700 via-orange-500 to-red-500'
    };
    return gradients[templateId] || 'from-gray-500 to-gray-600';
  };

  const renderTemplatePreview = (template: TemplateConfig) => {
    const colors = template.template_data.colors;
    const regions = template.template_data.regions;
    
    return (
      <div 
        className="aspect-[2.5/3.5] relative rounded-lg overflow-hidden"
        style={{ backgroundColor: colors.background }}
      >
        {/* Background pattern */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getTemplatePreviewGradient(template.id)} opacity-10`} />
        
        {/* Template-specific layout */}
        {template.id === 'tcg-classic' && (
          <>
            {/* Title area */}
            <div 
              className="absolute rounded text-center text-white text-xs font-bold flex items-center justify-center"
              style={{ 
                left: `${(regions.title.x / 300) * 100}%`,
                top: `${(regions.title.y / 350) * 100}%`,
                width: `${(regions.title.width / 300) * 100}%`,
                height: `${(regions.title.height / 350) * 100}%`,
                backgroundColor: colors.primary 
              }}
            >
              CARD NAME
            </div>
            {/* Image placeholder */}
            <div 
              className="absolute border-2 border-dashed border-gray-400 rounded flex items-center justify-center"
              style={{ 
                left: `${(regions.image.x / 300) * 100}%`,
                top: `${(regions.image.y / 350) * 100}%`,
                width: `${(regions.image.width / 300) * 100}%`,
                height: `${(regions.image.height / 350) * 100}%`,
              }}
            >
              <span className="text-xs text-gray-500">Image</span>
            </div>
            {/* Stats area */}
            <div 
              className="absolute rounded text-xs p-1"
              style={{ 
                left: `${(regions.stats.x / 300) * 100}%`,
                top: `${(regions.stats.y / 350) * 100}%`,
                width: `${(regions.stats.width / 300) * 100}%`,
                height: `${(regions.stats.height / 350) * 100}%`,
                backgroundColor: colors.secondary,
                color: colors.text === '#ffffff' ? '#000000' : colors.text
              }}
            >
              Stats & Info
            </div>
          </>
        )}
        
        {template.id === 'sports-modern' && (
          <>
            {/* Player name */}
            <div 
              className="absolute text-white text-xs font-bold flex items-center"
              style={{ 
                left: `${(regions.playerName.x / 300) * 100}%`,
                top: `${(regions.playerName.y / 350) * 100}%`,
                width: `${(regions.playerName.width / 300) * 100}%`,
                height: `${(regions.playerName.height / 350) * 100}%`,
                backgroundColor: colors.primary 
              }}
            >
              <span className="ml-2">PLAYER NAME</span>
            </div>
            {/* Action shot area */}
            <div 
              className="absolute border-2 border-dashed border-gray-400 rounded flex items-center justify-center"
              style={{ 
                left: `${(regions.image.x / 300) * 100}%`,
                top: `${(regions.image.y / 350) * 100}%`,
                width: `${(regions.image.width / 300) * 100}%`,
                height: `${(regions.image.height / 350) * 100}%`,
              }}
            >
              <span className="text-xs text-gray-500">Action Shot</span>
            </div>
            {/* Team info */}
            <div className="absolute bottom-0 left-0 right-0 p-2" style={{ backgroundColor: colors.accent }}>
              <div className="text-xs font-medium">TEAM • POSITION</div>
            </div>
          </>
        )}

        {/* Full-bleed templates */}
        {template.id === 'clean-photo-card' && (
          <>
            {/* Full background image placeholder */}
            <div className="absolute inset-0 border-2 border-dashed border-gray-400 rounded flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-400">
              <span className="text-xs text-gray-600 font-medium">Full Photo Background</span>
            </div>
            {/* CRD Logo */}
            <div 
              className="absolute text-xs font-bold bg-black bg-opacity-50 text-white rounded px-1"
              style={{ 
                left: `${(regions.logo.x / 300) * 100}%`,
                top: `${(regions.logo.y / 350) * 100}%`,
                width: `${(regions.logo.width / 300) * 100}%`,
                height: `${(regions.logo.height / 350) * 100}%`,
              }}
            >
              CRD
            </div>
            {/* Name overlay */}
            <div 
              className="absolute text-white text-xs font-bold bg-black bg-opacity-50 rounded px-2 flex items-center"
              style={{ 
                left: `${(regions.name.x / 300) * 100}%`,
                top: `${(regions.name.y / 350) * 100}%`,
                width: `${(regions.name.width / 300) * 100}%`,
                height: `${(regions.name.height / 350) * 100}%`,
              }}
            >
              Card Name
            </div>
          </>
        )}

        {template.id === 'social-sticker-card' && (
          <>
            {/* Full background image placeholder */}
            <div className="absolute inset-0 border-2 border-dashed border-purple-400 rounded flex items-center justify-center bg-gradient-to-br from-purple-200 to-pink-200">
              <span className="text-xs text-purple-600 font-medium">Photo + Stickers</span>
            </div>
            {/* Sample stickers */}
            <div className="absolute top-4 right-4 text-2xl">🔥</div>
            <div className="absolute bottom-4 left-4 text-xl">⭐</div>
            <div className="absolute top-1/2 right-6 text-lg transform -rotate-12">💪</div>
          </>
        )}

        {template.id === 'school-academic' && (
          <>
            {/* Name header */}
            <div 
              className="absolute text-center font-bold text-sm flex items-center justify-center"
              style={{ 
                left: `${(regions.name.x / 300) * 100}%`,
                top: `${(regions.name.y / 350) * 100}%`,
                width: `${(regions.name.width / 300) * 100}%`,
                height: `${(regions.name.height / 350) * 100}%`,
                backgroundColor: colors.primary,
                color: colors.secondary
              }}
            >
              STUDENT NAME
            </div>
            {/* Portrait area */}
            <div 
              className="absolute border-2 border-dashed border-gray-400 rounded-full flex items-center justify-center"
              style={{ 
                left: `${(regions.image.x / 300) * 100}%`,
                top: `${(regions.image.y / 350) * 100}%`,
                width: `${(regions.image.width / 300) * 100}%`,
                height: `${(regions.image.height / 350) * 100}%`,
              }}
            >
              <span className="text-xs text-gray-500">Portrait</span>
            </div>
            {/* Achievement area */}
            <div className="absolute bottom-0 left-0 right-0 p-2 text-center" style={{ backgroundColor: colors.secondary }}>
              <div className="text-xs font-medium" style={{ color: colors.text }}>Achievement Info</div>
            </div>
          </>
        )}
        
        {template.id === 'organization-corporate' && (
          <>
            {/* Executive name */}
            <div 
              className="absolute text-center font-bold text-sm flex items-center justify-center"
              style={{ 
                left: `${(regions.name.x / 300) * 100}%`,
                top: `${(regions.name.y / 350) * 100}%`,
                width: `${(regions.name.width / 300) * 100}%`,
                height: `${(regions.name.height / 350) * 100}%`,
                backgroundColor: colors.primary,
                color: colors.secondary
              }}
            >
              EXECUTIVE NAME
            </div>
            {/* Professional photo */}
            <div 
              className="absolute border-2 border-dashed border-gray-400 rounded flex items-center justify-center"
              style={{ 
                left: `${(regions.image.x / 300) * 100}%`,
                top: `${(regions.image.y / 350) * 100}%`,
                width: `${(regions.image.width / 300) * 100}%`,
                height: `${(regions.image.height / 350) * 100}%`,
              }}
            >
              <span className="text-xs text-gray-500">Photo</span>
            </div>
            {/* Company info */}
            <div className="absolute bottom-0 left-0 right-0 p-2" style={{ backgroundColor: colors.accent }}>
              <div className="text-xs font-medium text-white">COMPANY • TITLE</div>
            </div>
          </>
        )}
        
        {template.id === 'friends-social' && (
          <>
            {/* Fun title */}
            <div 
              className="absolute text-center font-bold text-sm flex items-center justify-center rounded-full"
              style={{ 
                left: `${(regions.title.x / 300) * 100}%`,
                top: `${(regions.title.y / 350) * 100}%`,
                width: `${(regions.title.width / 300) * 100}%`,
                height: `${(regions.title.height / 350) * 100}%`,
                backgroundColor: colors.primary,
                color: 'white'
              }}
            >
              BEST FRIENDS
            </div>
            {/* Memory photo */}
            <div 
              className="absolute border-2 border-dashed border-pink-300 rounded-lg flex items-center justify-center"
              style={{ 
                left: `${(regions.image.x / 300) * 100}%`,
                top: `${(regions.image.y / 350) * 100}%`,
                width: `${(regions.image.width / 300) * 100}%`,
                height: `${(regions.image.height / 350) * 100}%`,
              }}
            >
              <span className="text-xs text-pink-500">Memory Photo</span>
            </div>
            {/* Fun footer */}
            <div className="absolute bottom-0 left-0 right-0 p-2 text-center rounded-lg" style={{ backgroundColor: colors.accent }}>
              <div className="text-xs font-medium text-white">♥ Forever Friends ♥</div>
            </div>
          </>
        )}
        
        {template.id === 'vintage-retro' && (
          <>
            {/* Vintage title with decorative border */}
            <div 
              className="absolute text-center font-bold text-sm flex items-center justify-center border-2"
              style={{ 
                left: `${(regions.title.x / 300) * 100}%`,
                top: `${(regions.title.y / 350) * 100}%`,
                width: `${(regions.title.width / 300) * 100}%`,
                height: `${(regions.title.height / 350) * 100}%`,
                backgroundColor: colors.secondary,
                borderColor: colors.primary,
                color: colors.primary
              }}
            >
              VINTAGE CARD
            </div>
            {/* Classic image frame */}
            <div 
              className="absolute border-4 border-double flex items-center justify-center"
              style={{ 
                left: `${(regions.image.x / 300) * 100}%`,
                top: `${(regions.image.y / 350) * 100}%`,
                width: `${(regions.image.width / 300) * 100}%`,
                height: `${(regions.image.height / 350) * 100}%`,
                borderColor: colors.primary
              }}
            >
              <span className="text-xs" style={{ color: colors.primary }}>Classic Photo</span>
            </div>
            {/* Rarity gem */}
            <div className="absolute bottom-2 right-2 w-4 h-4 rounded-full" style={{ backgroundColor: colors.accent }}></div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-white mb-2">Choose Your Template</h2>
        <p className="text-crd-lightGray">Select a design style that fits your vision</p>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => onTemplateSelect(template)}
            className={`p-4 rounded-xl cursor-pointer transition-all border ${
              selectedTemplate?.id === template.id
                ? 'ring-2 ring-crd-green bg-editor-tool border-crd-green'
                : 'bg-editor-tool hover:bg-editor-border border-editor-border'
            }`}
          >
            {renderTemplatePreview(template)}
            
            <div className="space-y-2 mt-3">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-medium text-sm">{template.name}</h3>
                {template.is_premium && (
                  <Badge className="bg-yellow-500 text-black text-xs">
                    <Star className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                )}
              </div>
              <p className="text-crd-lightGray text-xs">{template.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{template.usage_count} uses</span>
                <span>{template.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
