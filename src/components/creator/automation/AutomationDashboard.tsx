
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCreatorAutomation } from '@/hooks/creator/useCreatorAutomation';
import { AutomationRuleEditor } from './AutomationRuleEditor';
import { Bot, TrendingUp, Shield, Share2, Package, Play, Pause, Trash2 } from 'lucide-react';

export const AutomationDashboard: React.FC = () => {
  const { automationRules, isLoading, updateRule, deleteRule } = useCreatorAutomation();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const getRuleIcon = (ruleType: string) => {
    switch (ruleType) {
      case 'pricing_optimization': return TrendingUp;
      case 'quality_assurance': return Shield;
      case 'content_moderation': return Shield;  
      case 'social_promotion': return Share2;
      case 'bulk_processing': return Package;
      default: return Bot;
    }
  };

  const getRuleColor = (ruleType: string) => {
    switch (ruleType) {
      case 'pricing_optimization': return 'text-green-400';
      case 'quality_assurance': return 'text-blue-400';
      case 'content_moderation': return 'text-yellow-400';
      case 'social_promotion': return 'text-purple-400';
      case 'bulk_processing': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  const formatRuleType = (ruleType: string) => {
    return ruleType.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const toggleRule = async (ruleId: string, isActive: boolean) => {
    await updateRule.mutateAsync({ id: ruleId, is_active: !isActive });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-crd-dark border-crd-mediumGray animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-crd-mediumGray rounded mb-2"></div>
              <div className="h-3 bg-crd-mediumGray rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Automation Dashboard</h2>
          <p className="text-crd-lightGray">
            Automate your workflow with intelligent rules and AI assistance
          </p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="bg-crd-green hover:bg-green-600 text-black"
        >
          <Bot className="w-4 h-4 mr-2" />
          Create Rule
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-crd-dark border-crd-mediumGray">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-crd-lightGray text-sm">Total Rules</p>
                <p className="text-2xl font-bold text-white">{automationRules.length}</p>
              </div>
              <Bot className="w-8 h-8 text-crd-green" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-crd-dark border-crd-mediumGray">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-crd-lightGray text-sm">Active Rules</p>
                <p className="text-2xl font-bold text-white">
                  {automationRules.filter(rule => rule.is_active).length}
                </p>
              </div>
              <Play className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-crd-dark border-crd-mediumGray">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-crd-lightGray text-sm">Total Executions</p>
                <p className="text-2xl font-bold text-white">
                  {automationRules.reduce((sum, rule) => sum + rule.execution_count, 0)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-crd-dark border-crd-mediumGray">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-crd-lightGray text-sm">Avg Success Rate</p>
                <p className="text-2xl font-bold text-white">
                  {automationRules.length > 0 
                    ? Math.round(automationRules.reduce((sum, rule) => sum + rule.success_rate, 0) / automationRules.length)
                    : 0}%
                </p>
              </div>
              <Shield className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rules List */}
      <Card className="bg-crd-dark border-crd-mediumGray">
        <CardHeader>
          <CardTitle className="text-white">Automation Rules</CardTitle>
        </CardHeader>
        <CardContent>
          {automationRules.length === 0 ? (
            <div className="text-center py-12">
              <Bot className="w-12 h-12 text-crd-lightGray mx-auto mb-4" />
              <h3 className="text-white text-lg font-semibold mb-2">No automation rules yet</h3>
              <p className="text-crd-lightGray mb-4">
                Create your first automation rule to start optimizing your workflow
              </p>
              <Button 
                onClick={() => setShowCreateModal(true)}
                className="bg-crd-green hover:bg-green-600 text-black"
              >
                Create Your First Rule
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {automationRules.map((rule) => {
                const Icon = getRuleIcon(rule.rule_type);
                const iconColor = getRuleColor(rule.rule_type);
                
                return (
                  <div key={rule.id} className="flex items-center justify-between p-4 bg-crd-mediumGray rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${iconColor}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">
                          {formatRuleType(rule.rule_type)}
                        </h4>
                        <p className="text-crd-lightGray text-sm">
                          Executed {rule.execution_count} times • {rule.success_rate}% success rate
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant={rule.is_active ? "default" : "secondary"}>
                        {rule.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleRule(rule.id, rule.is_active)}
                      >
                        {rule.is_active ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteRule.mutateAsync(rule.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Rule Modal */}
      {showCreateModal && (
        <AutomationRuleEditor 
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
};
