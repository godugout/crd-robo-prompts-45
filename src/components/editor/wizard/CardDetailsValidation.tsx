
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import type { CardData } from '@/hooks/useCardEditor';

interface CardDetailsValidationProps {
  cardData: CardData;
}

export const CardDetailsValidation = ({ cardData }: CardDetailsValidationProps) => {
  const validationChecks = [
    {
      key: 'title',
      label: 'Card Title',
      isValid: cardData.title && cardData.title.trim().length >= 3,
      requirement: 'At least 3 characters required',
      current: cardData.title?.length || 0
    },
    {
      key: 'description',
      label: 'Description',
      isValid: !cardData.description || cardData.description.trim().length >= 10,
      requirement: 'Optional, but recommended (10+ characters)',
      current: cardData.description?.length || 0,
      optional: true
    },
    {
      key: 'tags',
      label: 'Tags',
      isValid: cardData.tags.length >= 1,
      requirement: 'At least 1 tag required',
      current: cardData.tags.length
    },
    {
      key: 'image',
      label: 'Image',
      isValid: !!cardData.image_url,
      requirement: 'Image must be uploaded',
      current: cardData.image_url ? 1 : 0
    }
  ];

  const requiredChecks = validationChecks.filter(check => !check.optional);
  const validRequiredChecks = requiredChecks.filter(check => check.isValid);
  const completionPercentage = Math.round((validRequiredChecks.length / requiredChecks.length) * 100);

  return (
    <div className="space-y-4">
      {/* Completion Overview */}
      <div className="bg-editor-tool p-4 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-crd-white font-medium">Card Completion</h4>
          <Badge 
            className={completionPercentage === 100 ? "bg-crd-green text-crd-dark" : "bg-yellow-500 text-crd-dark"}
          >
            {completionPercentage}% Complete
          </Badge>
        </div>
        
        <div className="w-full bg-editor-border rounded-full h-2 mb-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              completionPercentage === 100 ? 'bg-crd-green' : 'bg-yellow-500'
            }`}
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        
        <p className="text-crd-lightGray text-xs">
          {completionPercentage === 100 
            ? "✨ Your card is ready to create!" 
            : "Complete the required fields to continue"
          }
        </p>
      </div>

      {/* Validation Checklist */}
      <div className="space-y-2">
        {validationChecks.map((check) => (
          <div 
            key={check.key}
            className={`flex items-center gap-3 p-3 rounded-lg border ${
              check.isValid 
                ? 'border-crd-green/30 bg-crd-green/10' 
                : check.optional
                  ? 'border-editor-border bg-editor-tool'
                  : 'border-red-500/30 bg-red-500/10'
            }`}
          >
            <div className="flex-shrink-0">
              {check.isValid ? (
                <CheckCircle className="w-4 h-4 text-crd-green" />
              ) : check.optional ? (
                <Info className="w-4 h-4 text-crd-lightGray" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-500" />
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${
                  check.isValid ? 'text-crd-green' : 'text-crd-white'
                }`}>
                  {check.label}
                  {check.optional && (
                    <span className="text-crd-lightGray ml-1">(Optional)</span>
                  )}
                </span>
                
                <span className="text-xs text-crd-lightGray">
                  {check.key === 'image' 
                    ? (check.current ? 'Added' : 'Missing')
                    : `${check.current}${check.key === 'tags' ? ' tags' : ' chars'}`
                  }
                </span>
              </div>
              
              <p className="text-xs text-crd-lightGray mt-1">
                {check.requirement}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Helpful Tips */}
      <div className="bg-editor-darker p-4 rounded-lg border border-editor-border">
        <h5 className="text-crd-white font-medium text-sm mb-2">💡 Tips for better cards:</h5>
        <ul className="text-xs text-crd-lightGray space-y-1">
          <li>• Use descriptive titles that capture the essence of your card</li>
          <li>• Add relevant tags to help others discover your card</li>
          <li>• Include a description to tell the story behind your card</li>
          <li>• Choose a rarity that matches the uniqueness of your content</li>
        </ul>
      </div>
    </div>
  );
};
