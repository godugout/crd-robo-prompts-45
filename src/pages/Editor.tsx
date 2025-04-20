
import React, { useState, useEffect } from 'react';
import { Topbar } from '@/components/editor/Topbar';
import { Toolbar } from '@/components/editor/Toolbar';
import { LeftSidebar } from '@/components/editor/LeftSidebar';
import { RightSidebar } from '@/components/editor/RightSidebar';
import { Canvas } from '@/components/editor/Canvas';
import { toast } from 'sonner';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle
} from '@/components/ui/resizable';

const Editor = () => {
  const [zoom, setZoom] = useState(100);
  const [selectedTemplate, setSelectedTemplate] = useState("template1");
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [cardData, setCardData] = useState({
    title: "No roads needed",
    description: "Where we're going, there are only cards. An original digital art piece inspired by BTTF.",
    category: "Movies",
    type: "Handcrafted",
    series: "80s VCR",
    tags: ["MOVIES", "HANDCRAFTED", "80sVCR"]
  });

  useEffect(() => {
    // Simulate loading of editor resources
    const timer = setTimeout(() => {
      setIsLoading(false);
      toast.success('Editor loaded successfully', {
        description: 'Start creating your amazing card!',
      });
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    
    // Different template presets based on selection
    if (templateId === 'template1') {
      setCardData({
        ...cardData,
        series: '80s VCR'
      });
    } else if (templateId === 'template2') {
      setCardData({
        ...cardData,
        series: 'Classic Cardboard'
      });
    } else if (templateId === 'template3') {
      setCardData({
        ...cardData,
        series: 'Nifty Framework'
      });
    } else if (templateId === 'template4') {
      setCardData({
        ...cardData,
        series: 'Synthwave Dreams',
        category: 'Music'
      });
    }
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen bg-editor-darker">
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-cardshow-green border-t-transparent rounded-full animate-spin mb-4"></div>
            <h2 className="text-white text-xl font-medium">Loading Editor</h2>
            <p className="text-cardshow-lightGray mt-2">Preparing your creative tools...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-editor-darker">
      <Topbar toggleSidebar={toggleSidebar} sidebarVisible={sidebarVisible} />
      <Toolbar onZoomChange={setZoom} currentZoom={zoom} />
      
      <div className="flex-1 flex overflow-hidden">
        {sidebarVisible && (
          <div className="w-80 md:w-auto transform transition-all duration-300 ease-in-out">
            <LeftSidebar 
              selectedTemplate={selectedTemplate}
              onSelectTemplate={handleTemplateSelect}
            />
          </div>
        )}
        
        <ResizablePanelGroup
          direction="horizontal"
          className="flex-1"
        >
          <ResizablePanel 
            defaultSize={70} 
            minSize={50}
            className="bg-editor-darker flex flex-col items-center justify-center"
          >
            <Canvas zoom={zoom} />
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel 
            defaultSize={30} 
            minSize={20}
            className="bg-editor-dark"
          >
            <RightSidebar />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default Editor;
