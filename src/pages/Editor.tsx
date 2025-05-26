
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { SimpleCardWizard } from '@/components/editor/SimpleCardWizard';
import { SimpleEditor } from '@/components/editor/SimpleEditor';

const Editor = () => {
  const { cardId } = useParams<{ cardId?: string }>();
  const [wizardComplete, setWizardComplete] = useState(!!cardId); // Skip wizard if we have cardId
  const [cardData, setCardData] = useState<{ photo: string; templateId: string } | null>(null);

  const handleWizardComplete = (data: { photo: string; templateId: string }) => {
    setCardData(data);
    setWizardComplete(true);
  };

  // If we have a cardId, go directly to editor
  if (cardId) {
    return <SimpleEditor initialData={{ id: cardId }} />;
  }

  if (!wizardComplete) {
    return <SimpleCardWizard onComplete={handleWizardComplete} />;
  }

  return cardData ? <SimpleEditor initialData={cardData} /> : null;
};

export default Editor;
