
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Users } from 'lucide-react';

interface BulkUploadOptionProps {
  onSelectBulkUpload: () => void;
}

export const BulkUploadOption = ({ onSelectBulkUpload }: BulkUploadOptionProps) => {
  return (
    <div className="bg-editor-tool p-4 rounded-lg border border-editor-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-crd-orange/20 rounded-lg flex items-center justify-center">
            <Upload className="w-5 h-5 text-crd-orange" />
          </div>
          <div>
            <h3 className="text-white font-medium text-sm">Need to upload multiple cards?</h3>
            <p className="text-crd-lightGray text-xs">Use our bulk upload tool to process many cards at once</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onSelectBulkUpload}
          className="border-crd-orange text-crd-orange hover:bg-crd-orange hover:text-black"
        >
          <Users className="w-4 h-4 mr-2" />
          Bulk Upload
        </Button>
      </div>
    </div>
  );
};
