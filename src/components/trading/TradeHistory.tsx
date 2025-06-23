
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TradeMessage, TradeMessageRow } from '@/hooks/trading/types';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, User, Clock } from 'lucide-react';

interface TradeHistoryProps {
  tradeId: string;
}

export const TradeHistory: React.FC<TradeHistoryProps> = ({ tradeId }) => {
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['trade-history', tradeId],
    queryFn: async (): Promise<TradeMessage[]> => {
      const { data, error } = await supabase
        .from('trade_messages')
        .select('*')
        .eq('trade_id', tradeId)
        .order('timestamp', { ascending: false });

      if (error) throw error;
      
      // Cast the raw database results to our typed interface
      return (data || []).map((row: TradeMessageRow): TradeMessage => ({
        ...row,
        message_type: row.message_type as TradeMessage['message_type'],
        metadata: row.metadata || {}
      }));
    },
    enabled: !!tradeId
  });

  const getMessageIcon = (type: TradeMessage['message_type']) => {
    switch (type) {
      case 'system':
        return <Clock className="w-4 h-4 text-crd-lightGray" />;
      case 'offer':
        return <MessageSquare className="w-4 h-4 text-crd-green" />;
      default:
        return <User className="w-4 h-4 text-crd-lightGray" />;
    }
  };

  const getMessageTypeLabel = (type: TradeMessage['message_type']) => {
    switch (type) {
      case 'system':
        return 'System';
      case 'offer':
        return 'Trade Update';
      case 'image':
        return 'Image';
      case 'emoji':
        return 'Reaction';
      default:
        return 'Message';
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-crd-dark border-crd-mediumGray">
        <CardContent className="p-6">
          <div className="text-center text-crd-lightGray">Loading trade history...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-crd-dark border-crd-mediumGray">
      <CardHeader>
        <CardTitle className="text-white">Trade Activity History</CardTitle>
      </CardHeader>
      <CardContent>
        {messages.length === 0 ? (
          <div className="text-center py-8 text-crd-lightGray">
            No activity yet in this trade.
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className="flex items-start gap-3 p-4 bg-crd-mediumGray rounded-lg"
              >
                <div className="flex-shrink-0 mt-1">
                  {getMessageIcon(message.message_type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-white">
                      {getMessageTypeLabel(message.message_type)}
                    </span>
                    <span className="text-xs text-crd-lightGray">
                      {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                  
                  <p className="text-sm text-crd-lightGray break-words">
                    {message.message}
                  </p>
                  
                  {message.attachment_url && (
                    <div className="mt-2">
                      <img
                        src={message.attachment_url}
                        alt="Attachment"
                        className="max-w-sm rounded border border-crd-mediumGray"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
