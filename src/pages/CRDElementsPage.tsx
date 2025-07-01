
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CRDElementsInterface } from '@/components/crdElements/CRDElementsInterface';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const CRDElementsPage: React.FC = () => {
  const navigate = useNavigate();

  const handleCardCreated = (cardData: any) => {
    console.log('Card created with CRD Elements:', cardData);
    toast.success('Card created successfully with advanced 3D processing!');
    
    // Could navigate to card editor or gallery
    // navigate('/cards');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-crd-darkest via-[#0a0a0b] to-[#131316]">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate('/')}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-bold text-white">CRD Elements</h1>
                <p className="text-sm text-gray-400">Advanced PSD Processing & 3D Reconstruction</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-8">
        <CRDElementsInterface onCardCreated={handleCardCreated} />
      </div>
    </div>
  );
};

export default CRDElementsPage;
