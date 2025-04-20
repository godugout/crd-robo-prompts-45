
import React, { useState } from 'react';
import { Topbar } from '@/components/editor/Topbar';
import { Toolbar } from '@/components/editor/Toolbar';
import { LeftSidebar } from '@/components/editor/LeftSidebar';
import { RightSidebar } from '@/components/editor/RightSidebar';
import { Canvas } from '@/components/editor/Canvas';

const Editor = () => {
  const [zoom, setZoom] = useState(100);
  const [selectedTemplate, setSelectedTemplate] = useState("template1");
  const [cardData, setCardData] = useState({
    title: "No roads needed",
    description: "Where we're going, there are only cards. An original digital art piece inspired by BTTF.",
    category: "Movies",
    type: "Handcrafted",
    series: "80s VCR",
    tags: ["MOVIES", "HANDCRAFTED", "80sVCR"]
  });

  return (
    <div className="flex flex-col h-screen bg-editor-darker">
      <Topbar />
      <Toolbar onZoomChange={setZoom} currentZoom={zoom} />
      <div className="flex-1 flex overflow-hidden">
        <LeftSidebar 
          selectedTemplate={selectedTemplate}
          onSelectTemplate={setSelectedTemplate}
        />
        <Canvas zoom={zoom} />
        <RightSidebar />
      </div>
    </div>
  );
};

export default Editor;
