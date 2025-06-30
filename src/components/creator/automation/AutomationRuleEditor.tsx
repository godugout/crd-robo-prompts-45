
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useCreatorAutomation } from '@/hooks/creator/useCreatorAutomation';
import { Bot, TrendingUp, Shield, Share2, Package } from 'lucide-react';

interface AutomationRuleEditorProps {
  onClose: () => void;
  ruleId?: string;
}

export const AutomationRuleEditor: React.FC<AutomationRuleEditorProps> = ({ onClose, ruleId }) => {
  const { createRule } = useCreatorAutomation();
  const [formData, setFormData] = useState({
    rule_type: '' as any,
    conditions: {} as Record<string, any>,
    actions: {} as Record<string, any>,
  });

  const ruleTypes = [
    { value: 'pricing_optimization', label: 'Pricing Optimization', icon: TrendingUp, description: 'Automatically adjust prices based on market data' },
    { value: 'quality_assurance', label: 'Quality Assurance', icon: Shield, description: 'Validate card quality and compliance' },
    { value: 'content_moderation', label: 'Content Moderation', icon: Shield, description: 'Monitor and filter inappropriate content' },
    { value: 'social_promotion', label: 'Social Promotion', icon: Share2, description: 'Auto-share content on social media' },
    { value: 'bulk_processing', label: 'Bulk Processing', icon: Package, description: 'Process multiple cards simultaneously' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.rule_type) return;

    try {
      await createRule.mutateAsync(formData);
      onClose();
    } catch (error) {
      console.error('Failed to create rule:', error);
    }
  };

  const updateCondition = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      conditions: { ...prev.conditions, [key]: value }
    }));
  };

  const updateAction = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      actions: { ...prev.actions, [key]: value }
    }));
  };

  const renderRuleSpecificFields = () => {
    switch (formData.rule_type) {
      case 'pricing_optimization':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="min_price">Minimum Price ($)</Label>
              <Input
                id="min_price"
                type="number"
                step="0.01"
                placeholder="5.00"
                onChange={(e) => updateCondition('min_price', parseFloat(e.target.value))}
                className="bg-crd-mediumGray border-crd-lightGray text-white"
              />
            </div>
            <div>
              <Label htmlFor="max_price">Maximum Price ($)</Label>
              <Input
                id="max_price"
                type="number"
                step="0.01"
                placeholder="100.00"
                onChange={(e) => updateCondition('max_price', parseFloat(e.target.value))}
                className="bg-crd-mediumGray border-crd-lightGray text-white"
              />
            </div>
            <div>
              <Label htmlFor="adjustment_factor">Price Adjustment Factor</Label>
              <Input
                id="adjustment_factor"
                type="number"
                step="0.1"
                placeholder="1.1"
                onChange={(e) => updateAction('adjustment_factor', parseFloat(e.target.value))}
                className="bg-crd-mediumGray border-crd-lightGray text-white"
              />
            </div>
          </div>
        );

      case 'quality_assurance':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="min_resolution">Minimum Resolution (pixels)</Label>
              <Input
                id="min_resolution"
                type="number"
                placeholder="1024"
                onChange={(e) => updateCondition('min_resolution', parseInt(e.target.value))}
                className="bg-crd-mediumGray border-crd-lightGray text-white"
              />
            </div>
            <div>
              <Label htmlFor="required_tags">Required Tags (comma-separated)</Label>
              <Input
                id="required_tags"
                placeholder="sports, baseball, vintage"
                onChange={(e) => updateCondition('required_tags', e.target.value.split(',').map(t => t.trim()))}
                className="bg-crd-mediumGray border-crd-lightGray text-white"
              />
            </div>
          </div>
        );

      case 'social_promotion':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="platforms">Social Platforms</Label>
              <Select onValueChange={(value) => updateAction('platforms', [value])}>
                <SelectTrigger className="bg-crd-mediumGray border-crd-lightGray text-white">
                  <SelectValue placeholder="Select platforms" />
                </SelectTrigger>
                <SelectContent className="bg-crd-mediumGray border-crd-lightGray">
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="post_template">Post Template</Label>
              <Textarea
                id="post_template"
                placeholder="Check out my new card: {title} #{tags}"
                onChange={(e) => updateAction('post_template', e.target.value)}
                className="bg-crd-mediumGray border-crd-lightGray text-white"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-crd-dark border-crd-mediumGray text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            Create Automation Rule
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="rule_type">Rule Type</Label>
            <Select 
              value={formData.rule_type} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, rule_type: value as any }))}
            >
              <SelectTrigger className="bg-crd-mediumGray border-crd-lightGray text-white">
                <SelectValue placeholder="Select automation type" />
              </SelectTrigger>
              <SelectContent className="bg-crd-mediumGray border-crd-lightGray">
                {ruleTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <SelectItem key={type.value} value={type.value} className="text-white">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <div>
                          <div>{type.label}</div>
                          <div className="text-xs text-crd-lightGray">{type.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {formData.rule_type && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Rule Configuration</h3>
              {renderRuleSpecificFields()}
            </div>
          )}

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={!formData.rule_type || createRule.isPending}
              className="bg-crd-green hover:bg-green-600 text-black"
            >
              {createRule.isPending ? 'Creating...' : 'Create Rule'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
