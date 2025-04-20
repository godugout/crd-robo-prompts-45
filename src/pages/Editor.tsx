
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Editor = () => {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Card Editor</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Advanced canvas editor for creating and customizing cards.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Editor;
