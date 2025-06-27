
import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Eye, Palette, MousePointer } from 'lucide-react';

interface CollaboratorCursor {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
  tool: string;
  lastActive: number;
}

interface CollaborativeSession {
  id: string;
  cardId: string;
  collaborators: CollaboratorCursor[];
  isActive: boolean;
}

interface CollaborativeEditorProps {
  cardId: string;
  onCollaborationChange: (session: CollaborativeSession) => void;
}

export const CollaborativeEditor: React.FC<CollaborativeEditorProps> = ({
  cardId,
  onCollaborationChange
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [session, setSession] = useState<CollaborativeSession>({
    id: `collab-${cardId}`,
    cardId,
    collaborators: [],
    isActive: false
  });

  const [localCursor, setLocalCursor] = useState({ x: 0, y: 0 });
  const [selectedTool, setSelectedTool] = useState('brush');

  const collaboratorColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
    '#FECA57', '#FF9FF3', '#54A0FF', '#5F27CD'
  ];

  useEffect(() => {
    // Simulate joining a collaborative session
    const mockCollaborators: CollaboratorCursor[] = [
      {
        id: 'user-1',
        name: 'Alice',
        color: '#FF6B6B',
        x: 150,
        y: 200,
        tool: 'brush',
        lastActive: Date.now()
      },
      {
        id: 'user-2',
        name: 'Bob',
        color: '#4ECDC4',
        x: 300,
        y: 150,
        tool: 'eraser',
        lastActive: Date.now() - 5000
      }
    ];

    setSession(prev => ({
      ...prev,
      collaborators: mockCollaborators,
      isActive: true
    }));
  }, []);

  useEffect(() => {
    onCollaborationChange(session);
  }, [session, onCollaborationChange]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setLocalCursor({ x, y });

    // In a real implementation, this would broadcast to other users
    broadcastCursorPosition(x, y);
  };

  const broadcastCursorPosition = (x: number, y: number) => {
    // Simulate broadcasting cursor position to other collaborators
    setSession(prev => ({
      ...prev,
      collaborators: prev.collaborators.map(collab => {
        // Simulate other cursors moving slightly
        if (Math.random() > 0.95) {
          return {
            ...collab,
            x: collab.x + (Math.random() - 0.5) * 20,
            y: collab.y + (Math.random() - 0.5) * 20,
            lastActive: Date.now()
          };
        }
        return collab;
      })
    }));
  };

  const addNewCollaborator = () => {
    const names = ['Charlie', 'Diana', 'Eve', 'Frank', 'Grace'];
    const availableName = names[Math.floor(Math.random() * names.length)];
    const availableColor = collaboratorColors[session.collaborators.length % collaboratorColors.length];

    const newCollaborator: CollaboratorCursor = {
      id: `user-${Date.now()}`,
      name: availableName,
      color: availableColor,
      x: Math.random() * 400,
      y: Math.random() * 300,
      tool: ['brush', 'eraser', 'text'][Math.floor(Math.random() * 3)],
      lastActive: Date.now()
    };

    setSession(prev => ({
      ...prev,
      collaborators: [...prev.collaborators, newCollaborator]
    }));
  };

  const isActive = (cursor: CollaboratorCursor) => {
    return Date.now() - cursor.lastActive < 10000; // Active within last 10 seconds
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-slate-900 to-indigo-900 text-white">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            Collaborative Editor
          </h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-green-400 border-green-400">
              {session.collaborators.filter(isActive).length + 1} Active
            </Badge>
            <button
              onClick={addNewCollaborator}
              className="px-3 py-1 bg-blue-600 rounded text-sm hover:bg-blue-700 transition-colors"
            >
              Invite Friend
            </button>
          </div>
        </div>

        {/* Collaborative Canvas */}
        <div
          ref={canvasRef}
          className="relative w-full h-64 bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-lg border border-white/20 overflow-hidden cursor-crosshair"
          onMouseMove={handleMouseMove}
        >
          {/* Background grid */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Collaborator Cursors */}
          {session.collaborators.map((cursor) => (
            <div
              key={cursor.id}
              className={`absolute transition-all duration-300 ${
                isActive(cursor) ? 'opacity-100' : 'opacity-50'
              }`}
              style={{
                left: cursor.x,
                top: cursor.y,
                transform: 'translate(-50%, -50%)'
              }}
            >
              {/* Cursor */}
              <div
                className="w-4 h-4 rounded-full border-2 border-white shadow-lg"
                style={{ backgroundColor: cursor.color }}
              />
              
              {/* Name label */}
              <div
                className="absolute top-6 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded text-xs whitespace-nowrap shadow-lg"
                style={{ backgroundColor: cursor.color }}
              >
                {cursor.name} ({cursor.tool})
              </div>

              {/* Tool indicator */}
              <div
                className="absolute -top-6 -left-6 w-3 h-3 rounded border border-white/50"
                style={{ backgroundColor: cursor.color }}
              >
                {cursor.tool === 'brush' && <Palette className="w-2 h-2 text-white" />}
                {cursor.tool === 'eraser' && <div className="w-2 h-2 bg-white rounded" />}
                {cursor.tool === 'text' && <div className="w-1 h-2 bg-white" />}
              </div>

              {/* Activity pulse */}
              {isActive(cursor) && (
                <div
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{ backgroundColor: cursor.color, opacity: 0.3 }}
                />
              )}
            </div>
          ))}

          {/* Your cursor */}
          <div
            className="absolute pointer-events-none"
            style={{
              left: localCursor.x,
              top: localCursor.y,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <MousePointer className="w-4 h-4 text-yellow-400" />
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-yellow-400 text-black rounded text-xs whitespace-nowrap">
              You ({selectedTool})
            </div>
          </div>
        </div>

        {/* Tool Selection */}
        <div className="flex items-center gap-2">
          <span className="text-sm">Tools:</span>
          {['brush', 'eraser', 'text', 'shapes'].map((tool) => (
            <button
              key={tool}
              onClick={() => setSelectedTool(tool)}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                selectedTool === tool
                  ? 'bg-yellow-400 text-black'
                  : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              {tool}
            </button>
          ))}
        </div>

        {/* Collaborator List */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Active Collaborators:</div>
          <div className="flex flex-wrap gap-2">
            {session.collaborators.filter(isActive).map((cursor) => (
              <div
                key={cursor.id}
                className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-sm"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: cursor.color }}
                />
                <span>{cursor.name}</span>
                <Eye className="w-3 h-3 opacity-50" />
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs opacity-75 pt-2">
          Move your mouse over the canvas to see collaborative cursors in action
        </div>
      </div>
    </Card>
  );
};
