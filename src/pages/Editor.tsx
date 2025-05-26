
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { SimpleCardWizard } from '@/components/editor/SimpleCardWizard';
import { SimpleEditor } from '@/components/editor/SimpleEditor';

const Editor = () => {
  const { cardId } = useParams<{ cardId?: string }>();
  const [wizardComplete, setWizardComplete] = useState(false);
  const [cardData, setCardData] = useState<{ photo: string; templateId: string } | null>(null);

  const handleWizardComplete = (data: { photo: string; templateId: string }) => {
    setCardData(data);
    setWizardComplete(true);
  };

  if (!wizardComplete) {
    return <SimpleCardWizard onComplete={handleWizardComplete} />;
  }

  return cardData ? <SimpleEditor initialData={cardData} /> : null;
};

export default Editor;
