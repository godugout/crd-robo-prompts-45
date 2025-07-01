
import React from 'react';
import { BulkPSDData } from '@/pages/BulkPSDAnalysisPage';
import { BulkAnalysisTable } from './BulkAnalysisTable';

interface PSDComparisonTableProps {
  psdData: BulkPSDData[];
  onRemovePSD: (id: string) => void;
}

export const PSDComparisonTable: React.FC<PSDComparisonTableProps> = (props) => {
  return <BulkAnalysisTable {...props} />;
};
