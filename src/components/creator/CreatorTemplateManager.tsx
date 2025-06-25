
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCardTemplates } from '@/hooks/creator/useCardTemplates';
import { CreateTemplateModal } from './CreateTemplateModal';
import { Plus, Edit, Eye, DollarSign, Star } from 'lucide-react';

export const CreatorTemplateManager: React.FC = () => {
  const { myTemplates, updateTemplate } = useCardTemplates();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  const toggleTemplateStatus = async (templateId: string, isActive: boolean) => {
    await updateTemplate.mutateAsync({
      id: templateId,
      updates: { is_active: !isActive },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">My Templates</h2>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-crd-green hover:bg-green-600 text-black"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Template
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myTemplates.map((template) => (
          <Card key={template.id} className="bg-crd-dark border-crd-mediumGray overflow-hidden">
            <div className="aspect-[3/4] bg-crd-mediumGray relative">
              {template.preview_images[0] ? (
                <img
                  src={template.preview_images[0]}
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-crd-lightGray">
                  No Preview
                </div>
              )}
              <div className="absolute top-2 right-2 flex gap-1">
                <Badge variant={template.is_active ? 'default' : 'secondary'} className="bg-crd-green text-black">
                  {template.is_active ? 'Active' : 'Inactive'}
                </Badge>
                {template.is_premium && (
                  <Badge variant="outline" className="border-yellow-400 text-yellow-400">
                    Premium
                  </Badge>
                )}
              </div>
            </div>

            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg">{template.name}</CardTitle>
              <p className="text-sm text-crd-lightGray line-clamp-2">
                {template.description || 'No description'}
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-crd-lightGray">Price</span>
                <span className="text-crd-green font-semibold">
                  {formatCurrency(template.price)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-white font-semibold">{template.sales_count}</div>
                  <div className="text-crd-lightGray">Sales</div>
                </div>
                <div className="text-center">
                  <div className="text-white font-semibold">
                    {formatCurrency(template.revenue_generated)}
                  </div>
                  <div className="text-crd-lightGray">Revenue</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-white">
                    {template.rating_average.toFixed(1)}
                  </span>
                  <span className="text-crd-lightGray">
                    ({template.rating_count})
                  </span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {template.category}
                </Badge>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setEditingTemplate(template.id)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant={template.is_active ? 'destructive' : 'default'}
                  onClick={() => toggleTemplateStatus(template.id, template.is_active)}
                >
                  {template.is_active ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {myTemplates.length === 0 && (
          <Card className="bg-crd-dark border-crd-mediumGray col-span-full">
            <CardContent className="text-center py-12">
              <div className="text-crd-lightGray mb-4">
                You haven't created any templates yet
              </div>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-crd-green hover:bg-green-600 text-black"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Template
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <CreateTemplateModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
};
