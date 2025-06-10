
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CardExpandableSectionProps {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  className?: string;
}

export const CardExpandableSection: React.FC<CardExpandableSectionProps> = ({
  title,
  icon: Icon,
  children,
  defaultExpanded = false,
  className
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <Card className={cn("bg-editor-dark/50 backdrop-blur-sm border-white/10", className)}>
      <CardContent className="p-0">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-2">
            {Icon && <Icon className="w-4 h-4 text-crd-lightGray" />}
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-crd-lightGray transition-transform" />
          ) : (
            <ChevronRight className="w-4 h-4 text-crd-lightGray transition-transform" />
          )}
        </button>
        
        {isExpanded && (
          <div className="px-4 pb-4 border-t border-white/10 animate-fade-in">
            {children}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
