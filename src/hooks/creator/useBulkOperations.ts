
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCreatorProfile } from './useCreatorProfile';
import { toast } from 'sonner';

export interface BulkOperation {
  id: string;
  creator_id: string;
  operation_type: 'batch_create' | 'bulk_edit' | 'mass_upload' | 'collection_export' | 'pricing_update';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  total_items: number;
  processed_items: number;
  failed_items: number;
  operation_data: Record<string, any>;
  error_log: Record<string, any>;
  result_summary: Record<string, any>;
  started_at?: string;
  completed_at?: string;
  created_at: string;
}

export const useBulkOperations = () => {
  const { profile } = useCreatorProfile();
  const queryClient = useQueryClient();

  const { data: operations, isLoading } = useQuery({
    queryKey: ['bulk-operations', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];

      const { data, error } = await supabase
        .from('bulk_operations')
        .select('*')
        .eq('creator_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as BulkOperation[];
    },
    enabled: !!profile?.id,
  });

  const createOperation = useMutation({
    mutationFn: async (operationData: {
      operation_type: BulkOperation['operation_type'];
      total_items: number;
      operation_data: Record<string, any>;
    }) => {
      if (!profile?.id) throw new Error('Creator profile required');

      const { data, error } = await supabase
        .from('bulk_operations')
        .insert({
          creator_id: profile.id,
          operation_type: operationData.operation_type,
          total_items: operationData.total_items,
          operation_data: operationData.operation_data,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['bulk-operations'] });
      toast.success(`Bulk operation "${data.operation_type}" started successfully!`);
    },
    onError: (error) => {
      toast.error(`Failed to start bulk operation: ${error.message}`);
    },
  });

  const updateOperationProgress = useMutation({
    mutationFn: async ({
      id,
      processed_items,
      failed_items,
      status,
      error_details,
    }: {
      id: string;
      processed_items?: number;
      failed_items?: number;
      status?: BulkOperation['status'];
      error_details?: any;
    }) => {
      const updates: any = {};
      
      if (processed_items !== undefined) updates.processed_items = processed_items;
      if (failed_items !== undefined) updates.failed_items = failed_items;
      if (status) updates.status = status;
      if (error_details) updates.error_log = error_details;
      
      if (status === 'processing' && !updates.started_at) {
        updates.started_at = new Date().toISOString();
      }
      
      if (status === 'completed' || status === 'failed') {
        updates.completed_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('bulk_operations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bulk-operations'] });
    },
  });

  const cancelOperation = useMutation({
    mutationFn: async (operationId: string) => {
      const { data, error } = await supabase
        .from('bulk_operations')
        .update({
          status: 'cancelled',
          completed_at: new Date().toISOString(),
        })
        .eq('id', operationId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bulk-operations'] });
      toast.success('Bulk operation cancelled successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to cancel operation: ${error.message}`);
    },
  });

  const getActiveOperations = () => {
    return operations?.filter(op => op.status === 'pending' || op.status === 'processing') || [];
  };

  const getCompletedOperations = () => {
    return operations?.filter(op => op.status === 'completed') || [];
  };

  const getFailedOperations = () => {
    return operations?.filter(op => op.status === 'failed') || [];
  };

  return {
    operations: operations || [],
    activeOperations: getActiveOperations(),
    completedOperations: getCompletedOperations(),
    failedOperations: getFailedOperations(),
    isLoading,
    createOperation,
    updateOperationProgress,
    cancelOperation,
  };
};
