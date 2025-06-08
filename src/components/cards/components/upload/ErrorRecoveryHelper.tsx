
import React, { useState } from 'react';
import { CRDButton } from '@/components/ui/design-system';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, RefreshCw, HelpCircle, ImageIcon, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';

interface ValidationError {
  type: 'size' | 'format' | 'dimensions' | 'corruption' | 'network' | 'unknown';
  message: string;
  suggestion?: string;
  autoRetryable?: boolean;
}

interface ErrorRecoveryHelperProps {
  errors: ValidationError[];
  fileName: string;
  onRetry: () => void;
  onOptimize?: () => void;
  onShowHelp: () => void;
  isRetrying?: boolean;
  retryCount?: number;
}

export const ErrorRecoveryHelper: React.FC<ErrorRecoveryHelperProps> = ({
  errors,
  fileName,
  onRetry,
  onOptimize,
  onShowHelp,
  isRetrying = false,
  retryCount = 0
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getErrorIcon = (type: ValidationError['type']) => {
    switch (type) {
      case 'size':
        return <Settings className="w-4 h-4 text-yellow-500" />;
      case 'format':
        return <ImageIcon className="w-4 h-4 text-red-500" />;
      case 'dimensions':
        return <Settings className="w-4 h-4 text-yellow-500" />;
      case 'corruption':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'network':
        return <RefreshCw className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getSuggestedActions = () => {
    const actions = [];
    
    errors.forEach(error => {
      switch (error.type) {
        case 'size':
          if (onOptimize) {
            actions.push({
              label: 'Compress Image',
              action: onOptimize,
              variant: 'secondary' as const,
              description: 'Reduce file size automatically'
            });
          }
          break;
        case 'network':
          actions.push({
            label: `Retry${retryCount > 0 ? ` (${retryCount})` : ''}`,
            action: onRetry,
            variant: 'primary' as const,
            description: 'Try uploading again'
          });
          break;
        case 'dimensions':
          if (onOptimize) {
            actions.push({
              label: 'Auto-Resize',
              action: onOptimize,
              variant: 'secondary' as const,
              description: 'Resize to recommended dimensions'
            });
          }
          break;
      }
    });

    // Always include retry if not already added
    if (!actions.some(a => a.label.includes('Retry'))) {
      actions.push({
        label: `Retry${retryCount > 0 ? ` (${retryCount})` : ''}`,
        action: onRetry,
        variant: 'outline' as const,
        description: 'Try validation again'
      });
    }

    return actions;
  };

  const suggestedActions = getSuggestedActions();
  const primaryError = errors[0];
  const hasAutoRetryableErrors = errors.some(e => e.autoRetryable);

  return (
    <Card className="bg-red-500/10 border-red-500/30">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            {getErrorIcon(primaryError.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-red-400 font-medium text-sm">
                Validation Failed: {fileName}
              </h4>
              <CRDButton
                onClick={() => setIsExpanded(!isExpanded)}
                variant="ghost"
                size="sm"
                className="text-crd-lightGray hover:text-crd-white h-6 w-6 p-0"
                aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
              >
                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </CRDButton>
            </div>

            <p className="text-red-300 text-xs mb-3">
              {primaryError.message}
              {primaryError.suggestion && (
                <span className="block mt-1 text-crd-lightGray">
                  💡 {primaryError.suggestion}
                </span>
              )}
            </p>

            {/* Suggested actions */}
            <div className="flex flex-wrap gap-2 mb-3">
              {suggestedActions.map((action, index) => (
                <CRDButton
                  key={index}
                  onClick={action.action}
                  variant={action.variant}
                  size="sm"
                  disabled={isRetrying}
                  className={`text-xs ${
                    action.variant === 'primary' 
                      ? 'bg-crd-green hover:bg-crd-green/80 text-black'
                      : action.variant === 'secondary'
                      ? 'bg-crd-lightGray hover:bg-crd-lightGray/80 text-black'
                      : 'border-crd-mediumGray text-crd-lightGray hover:text-crd-white'
                  }`}
                  title={action.description}
                >
                  {isRetrying && action.label.includes('Retry') ? (
                    <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                  ) : null}
                  {action.label}
                </CRDButton>
              ))}
              
              <CRDButton
                onClick={onShowHelp}
                variant="ghost"
                size="sm"
                className="text-crd-lightGray hover:text-crd-white text-xs"
                aria-label="Get help with this error"
              >
                <HelpCircle className="w-3 h-3 mr-1" />
                Help
              </CRDButton>
            </div>

            {/* Expanded error details */}
            {isExpanded && (
              <div className="border-t border-red-500/20 pt-3 mt-3">
                <div className="space-y-2">
                  {errors.map((error, index) => (
                    <div key={index} className="flex items-start gap-2 text-xs">
                      {getErrorIcon(error.type)}
                      <div>
                        <div className="text-red-300">{error.message}</div>
                        {error.suggestion && (
                          <div className="text-crd-lightGray mt-1">
                            {error.suggestion}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Auto-retry info */}
                {hasAutoRetryableErrors && (
                  <div className="mt-3 p-2 bg-crd-darkGray rounded text-xs text-crd-lightGray">
                    <strong>Auto-retry enabled:</strong> This error may resolve automatically. 
                    The system will retry with exponential backoff.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
