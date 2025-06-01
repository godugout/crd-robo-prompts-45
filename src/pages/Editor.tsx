
import React from 'react';
import { useParams } from 'react-router-dom';
import { CardCreationFlow } from '@/components/editor/CardCreationFlow';

const Editor = () => {
  const { cardId } = useParams<{ cardId?: string }>();

  return <CardCreationFlow initialCardId={cardId} />;
};

export default Editor;
