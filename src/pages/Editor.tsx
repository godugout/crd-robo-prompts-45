
import React from 'react';
import { SimpleCardForm } from '@/components/editor/SimpleCardForm';

const Editor = () => {
  return (
    <div className="min-h-screen bg-crd-darkest">
      <div className="container mx-auto py-8">
        <SimpleCardForm />
      </div>
    </div>
  );
};

export default Editor;
