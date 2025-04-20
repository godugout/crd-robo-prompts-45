
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Decks = () => {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Decks</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Manage your card decks and collections.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Decks;
