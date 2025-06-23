
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { TradeMessage, TradeMessageRow } from '@/hooks/trading/types';
import { Send, Smile } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface TradeChatProps {
  tradeId: string;
  typingUsers: string[];
  onTyping: (isTyping: boolean) => void;
  onSendMessage: (message: string) => Promise<TradeMessage | null>;
}

export const TradeChat: React.FC<TradeChatProps> = ({
  tradeId,
  typingUsers,
  onTyping,
  onSendMessage
}) => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Fetch messages
  const { data: messages = [], refetch: refetchMessages } = useQuery({
    queryKey: ['trade-messages', tradeId],
    queryFn: async (): Promise<TradeMessage[]> => {
      const { data, error } = await supabase
        .from('trade_messages')
        .select('*')
        .eq('trade_id', tradeId)
        .order('timestamp', { ascending: true });

      if (error) throw error;
      
      // Cast the raw database results to our typed interface
      return (data || []).map((row: TradeMessageRow): TradeMessage => ({
        ...row,
        message_type: row.message_type as TradeMessage['message_type'],
        metadata: row.metadata || {}
      }));
    },
    enabled: !!tradeId,
    refetchInterval: 1000 // Refetch every second for real-time updates
  });

  const handleInputChange = (value: string) => {
    setMessage(value);
    
    // Handle typing indicators
    if (value.length > 0 && !isTyping) {
      setIsTyping(true);
      onTyping(true);
    }
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      onTyping(false);
    }, 1000);
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const messageText = message.trim();
    setMessage('');
    setIsTyping(false);
    onTyping(false);

    try {
      await onSendMessage(messageText);
      await refetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const formatMessageTime = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  return (
    <Card className="bg-crd-dark border-crd-mediumGray h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-lg">Trade Chat</CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  msg.sender_id === user?.id
                    ? 'bg-crd-green text-black'
                    : 'bg-crd-mediumGray text-white'
                }`}
              >
                {msg.message_type === 'system' ? (
                  <div className="text-center text-sm italic text-crd-lightGray">
                    {msg.message}
                  </div>
                ) : (
                  <>
                    <p className="text-sm">{msg.message}</p>
                    <p className={`text-xs mt-1 ${
                      msg.sender_id === user?.id 
                        ? 'text-black/70' 
                        : 'text-crd-lightGray'
                    }`}>
                      {formatMessageTime(msg.timestamp)}
                    </p>
                  </>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {typingUsers.length > 0 && (
            <div className="flex justify-start">
              <div className="bg-crd-mediumGray text-white rounded-lg p-3 max-w-[70%]">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-crd-lightGray rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-crd-lightGray rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-crd-lightGray rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                  <span className="text-xs text-crd-lightGray">typing...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t border-crd-mediumGray p-4">
          <div className="flex items-center gap-2">
            <Input
              value={message}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 bg-crd-mediumGray border-crd-mediumGray text-white placeholder:text-crd-lightGray"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              size="sm"
              className="bg-crd-green hover:bg-crd-green/90 text-black"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
