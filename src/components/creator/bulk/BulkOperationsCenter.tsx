
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useBulkOperations } from '@/hooks/creator/useBulkOperations';
import { Package, Upload, Edit, Download, DollarSign, Play, Pause, X } from 'lucide-react';

export const BulkOperationsCenter: React.FC = () => {
  const { 
    operations, 
    activeOperations, 
    completedOperations, 
    failedOperations,
    isLoading, 
    createOperation, 
    cancelOperation 
  } = useBulkOperations();

  const [selectedOperation, setSelectedOperation] = useState<string>('');

  const operationTypes = [
    {
      type: 'batch_create',
      label: 'Batch Create Cards',
      description: 'Create multiple cards from templates',
      icon: Package,
    },
    {
      type: 'bulk_edit',
      label: 'Bulk Edit Properties',
      description: 'Edit multiple cards simultaneously',
      icon: Edit,
    },
    {
      type: 'mass_upload',
      label: 'Mass Upload Assets',
      description: 'Upload multiple design assets',
      icon: Upload,
    },
    {
      type: 'collection_export',
      label: 'Export Collections',
      description: 'Export card collections in various formats',
      icon: Download,
    },
    {
      type: 'pricing_update',
      label: 'Update Pricing',
      description: 'Batch update pricing for multiple items',
      icon: DollarSign,
    },
  ];

  const handleStartOperation = async (operationType: string) => {
    await createOperation.mutateAsync({
      operation_type: operationType as any,
      total_items: 10, // This would be dynamic based on user selection
      operation_data: {
        // This would contain the specific configuration for the operation
      },
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      case 'processing': return 'bg-blue-500';
      case 'cancelled': return 'bg-gray-500';
      default: return 'bg-yellow-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing': return Play;
      case 'completed': return Package;
      case 'failed': return X;
      default: return Pause;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Bulk Operations Center</h2>
        <p className="text-crd-lightGray">
          Manage large-scale operations and batch processing tasks
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-crd-dark border-crd-mediumGray">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-crd-lightGray text-sm">Active Operations</p>
                <p className="text-2xl font-bold text-white">{activeOperations.length}</p>
              </div>
              <Play className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-crd-dark border-crd-mediumGray">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-crd-lightGray text-sm">Completed</p>
                <p className="text-2xl font-bold text-white">{completedOperations.length}</p>
              </div>
              <Package className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-crd-dark border-crd-mediumGray">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-crd-lightGray text-sm">Failed</p>
                <p className="text-2xl font-bold text-white">{failedOperations.length}</p>
              </div>
              <X className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-crd-dark border-crd-mediumGray">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-crd-lightGray text-sm">Total Operations</p>
                <p className="text-2xl font-bold text-white">{operations.length}</p>
              </div>
              <Package className="w-8 h-8 text-crd-green" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Operation Types */}
      <Card className="bg-crd-dark border-crd-mediumGray">
        <CardHeader>
          <CardTitle className="text-white">Start New Operation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {operationTypes.map((opType) => {
              const Icon = opType.icon;
              return (
                <div 
                  key={opType.type}
                  className="p-4 bg-crd-mediumGray rounded-lg border border-crd-lightGray hover:border-crd-green transition-colors cursor-pointer"
                  onClick={() => setSelectedOperation(opType.type)}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="w-6 h-6 text-crd-green" />
                    <h3 className="text-white font-semibold">{opType.label}</h3>
                  </div>
                  <p className="text-crd-lightGray text-sm mb-3">{opType.description}</p>
                  <Button 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartOperation(opType.type);
                    }}
                    disabled={createOperation.isPending}
                    className="bg-crd-green hover:bg-green-600 text-black"
                  >
                    Start Operation
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Operations History */}
      <Card className="bg-crd-dark border-crd-mediumGray">
        <CardHeader>
          <CardTitle className="text-white">Operations History</CardTitle>
        </CardHeader>
        <CardContent>
          {operations.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-crd-lightGray mx-auto mb-4" />
              <h3 className="text-white text-lg font-semibold mb-2">No operations yet</h3>
              <p className="text-crd-lightGray">
                Start your first bulk operation to streamline your workflow
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {operations.map((operation) => {
                const StatusIcon = getStatusIcon(operation.status);
                const progress = operation.total_items > 0 
                  ? (operation.processed_items / operation.total_items) * 100 
                  : 0;

                return (
                  <div key={operation.id} className="p-4 bg-crd-mediumGray rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <StatusIcon className="w-5 h-5 text-crd-green" />
                        <div>
                          <h4 className="text-white font-medium">
                            {operationTypes.find(t => t.type === operation.operation_type)?.label || operation.operation_type}
                          </h4>
                          <p className="text-crd-lightGray text-sm">
                            {new Date(operation.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="secondary" 
                          className={`${getStatusColor(operation.status)} text-white`}
                        >
                          {operation.status}
                        </Badge>
                        
                        {operation.status === 'processing' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => cancelOperation.mutateAsync(operation.id)}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>

                    {operation.status === 'processing' && (
                      <div className="mb-2">
                        <div className="flex justify-between text-sm text-crd-lightGray mb-1">
                          <span>Progress</span>
                          <span>{operation.processed_items}/{operation.total_items}</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    )}

                    <div className="flex justify-between text-sm text-crd-lightGray">
                      <span>Total Items: {operation.total_items}</span>
                      <span>
                        {operation.failed_items > 0 && (
                          <span className="text-red-400">Failed: {operation.failed_items}</span>
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
