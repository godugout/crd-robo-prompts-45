
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, Edit3 } from 'lucide-react';
import { toast } from 'sonner';
import { FramedImagePreview } from './FramedImagePreview';
import type { FramedImage, StepProps } from '../types/bulkUploadTypes';

interface ReviewAndMarkStepProps extends StepProps {
  framedImages: FramedImage[];
  onReviewComplete: (approved: FramedImage[], needsEdit: FramedImage[]) => void;
}

export const ReviewAndMarkStep: React.FC<ReviewAndMarkStepProps> = ({
  framedImages,
  onReviewComplete,
  onGoBack
}) => {
  const [images, setImages] = useState<FramedImage[]>(framedImages);

  const handleApprove = (imageId: string) => {
    setImages(prev => prev.map(img => 
      img.id === imageId 
        ? { ...img, approved: true, needsAdjustment: false }
        : img
    ));
  };

  const handleMarkForEdit = (imageId: string) => {
    setImages(prev => prev.map(img => 
      img.id === imageId 
        ? { ...img, approved: false, needsAdjustment: true }
        : img
    ));
  };

  const handleApproveAll = () => {
    setImages(prev => prev.map(img => ({ 
      ...img, 
      approved: true, 
      needsAdjustment: false 
    })));
    toast.success('All images approved!');
  };

  const handleMarkAllForEdit = () => {
    setImages(prev => prev.map(img => ({ 
      ...img, 
      approved: false, 
      needsAdjustment: true 
    })));
    toast.success('All images marked for editing!');
  };

  const handleContinue = () => {
    const approved = images.filter(img => img.approved);
    const needsEdit = images.filter(img => img.needsAdjustment);
    const unmarked = images.filter(img => !img.approved && !img.needsAdjustment);

    if (unmarked.length > 0) {
      toast.error(`Please review all images. ${unmarked.length} image${unmarked.length !== 1 ? 's' : ''} still need to be marked.`);
      return;
    }

    onReviewComplete(approved, needsEdit);
  };

  const approvedCount = images.filter(img => img.approved).length;
  const editCount = images.filter(img => img.needsAdjustment).length;
  const unmarkedCount = images.filter(img => !img.approved && !img.needsAdjustment).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Review & Mark Your Cards</h2>
        <p className="text-crd-lightGray max-w-2xl mx-auto">
          Review each framed image and decide: approve cards that look good as-is, 
          or mark them for editing if they need position, crop, or frame adjustments.
        </p>
      </div>

      {/* Stats */}
      <div className="bg-editor-dark rounded-lg p-4">
        <div className="flex justify-center gap-8 text-center">
          <div>
            <div className="text-2xl font-bold text-crd-green">{approvedCount}</div>
            <div className="text-sm text-crd-lightGray">Approved</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-500">{editCount}</div>
            <div className="text-sm text-crd-lightGray">Needs Editing</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-crd-lightGray">{unmarkedCount}</div>
            <div className="text-sm text-crd-lightGray">Unmarked</div>
          </div>
        </div>
      </div>

      {/* Batch Actions */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={handleApproveAll}
          variant="outline"
          className="border-crd-green text-crd-green hover:bg-crd-green hover:text-black"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Approve All
        </Button>
        <Button
          onClick={handleMarkAllForEdit}
          variant="outline"
          className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black"
        >
          <Edit3 className="w-4 h-4 mr-2" />
          Mark All for Edit
        </Button>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((framedImage) => (
          <div key={framedImage.id} className="relative">
            <FramedImagePreview
              framedImage={framedImage}
              size="medium"
              showControls={true}
              onApprove={() => handleApprove(framedImage.id)}
              onMarkForEdit={() => handleMarkForEdit(framedImage.id)}
            />
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-4">
        <Button
          onClick={onGoBack}
          variant="outline"
          className="border-crd-mediumGray text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Upload
        </Button>

        <Button
          onClick={handleContinue}
          disabled={unmarkedCount > 0}
          className="bg-crd-green hover:bg-crd-green/90 text-black px-8"
        >
          {editCount > 0 
            ? `Continue to Edit (${editCount} image${editCount !== 1 ? 's' : ''})`
            : `Finish (${approvedCount} approved)`
          }
        </Button>
      </div>
    </div>
  );
};
