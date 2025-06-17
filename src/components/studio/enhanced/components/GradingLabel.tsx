
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Shield, Award, Star } from 'lucide-react';

interface GradingLabelProps {
  cardName: string;
  serialNumber?: string;
  overallGrade?: number;
  centeringGrade?: number;
  cornersGrade?: number;
  edgesGrade?: number;
  surfaceGrade?: number;
}

export const GradingLabel: React.FC<GradingLabelProps> = ({
  cardName,
  serialNumber = "CRD-2024-001",
  overallGrade = 9.5,
  centeringGrade = 9,
  cornersGrade = 10, 
  edgesGrade = 9,
  surfaceGrade = 10
}) => {
  const getGradeColor = (grade: number) => {
    if (grade >= 9.5) return 'text-yellow-400';
    if (grade >= 8.5) return 'text-green-400';
    if (grade >= 7) return 'text-blue-400';
    return 'text-gray-400';
  };

  const getGradeBg = (grade: number) => {
    if (grade >= 9.5) return 'bg-yellow-400/20 border-yellow-400/50';
    if (grade >= 8.5) return 'bg-green-400/20 border-green-400/50';
    if (grade >= 7) return 'bg-blue-400/20 border-blue-400/50';
    return 'bg-gray-400/20 border-gray-400/50';
  };

  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-2 border-white/20 rounded-lg p-4 relative overflow-hidden">
      {/* Authentication Watermark */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45">
          <Shield className="w-32 h-32 text-white" />
        </div>
      </div>

      {/* Header */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-crd-green rounded-full flex items-center justify-center">
              <span className="text-black font-black text-sm">C</span>
            </div>
            <div>
              <div className="text-white font-black text-lg tracking-wider">CRD</div>
              <div className="text-gray-400 text-xs">CARD RATING DIVISION</div>
            </div>
          </div>
          
          <Badge className={`${getGradeBg(overallGrade)} border text-lg font-black px-3 py-1`}>
            {overallGrade}
          </Badge>
        </div>

        {/* Card Information */}
        <div className="mb-4">
          <h3 className="text-white font-bold text-lg mb-1 truncate">
            {cardName || 'Untitled Card'}
          </h3>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span>Serial: {serialNumber}</span>
            <span>2024 Edition</span>
            <div className="flex items-center gap-1">
              <Award className="w-3 h-3" />
              <span>Authenticated</span>
            </div>
          </div>
        </div>

        {/* Grading Breakdown */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          <div className="text-center">
            <div className={`text-sm font-bold mb-1 ${getGradeColor(centeringGrade)}`}>
              {centeringGrade}
            </div>
            <div className="text-xs text-gray-400">CENTER</div>
          </div>
          
          <div className="text-center">
            <div className={`text-sm font-bold mb-1 ${getGradeColor(cornersGrade)}`}>
              {cornersGrade}
            </div>
            <div className="text-xs text-gray-400">CORNERS</div>
          </div>
          
          <div className="text-center">
            <div className={`text-sm font-bold mb-1 ${getGradeColor(edgesGrade)}`}>
              {edgesGrade}
            </div>
            <div className="text-xs text-gray-400">EDGES</div>
          </div>
          
          <div className="text-center">
            <div className={`text-sm font-bold mb-1 ${getGradeColor(surfaceGrade)}`}>
              {surfaceGrade}
            </div>
            <div className="text-xs text-gray-400">SURFACE</div>
          </div>
        </div>

        {/* Authentication Bar */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-crd-green">
            <Star className="w-3 h-3 fill-current" />
            <span className="font-bold">CERTIFIED AUTHENTIC</span>
          </div>
          <div className="text-gray-400">
            Grade Date: {new Date().toLocaleDateString()}
          </div>
        </div>

        {/* Holographic Security Strip */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 via-green-500 via-yellow-500 to-red-500 opacity-60" />
      </div>
    </div>
  );
};
