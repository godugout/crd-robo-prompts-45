
import React, { useState } from 'react';
import { Save, Share, Download, Settings, Moon, Sun, ChevronLeft, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';

export const Topbar = ({ toggleSidebar, sidebarVisible }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [autoSaveStatus, setAutoSaveStatus] = useState('saving');

  // Simulate auto saving
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setAutoSaveStatus('saved');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    toast.success(`Switched to ${!isDarkMode ? 'light' : 'dark'} mode`);
  };

  return (
    <div className="flex items-center justify-between h-16 px-4 bg-editor-dark border-b border-editor-border">
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          className="text-gray-400 hover:text-white md:p-2" 
          size="icon"
          onClick={toggleSidebar}
        >
          <Menu className="w-5 h-5" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
        
        <Button variant="ghost" className="text-gray-400 hover:text-white md:flex hidden" size="sm" asChild>
          <Link to="/">
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back
          </Link>
        </Button>
        
        <div className="w-px h-8 bg-editor-border mx-2 hidden md:block"></div>
        <h1 className="text-xl font-semibold text-white hidden md:block">Create a Card</h1>
        
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-gray-400">
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-editor-dark border-editor-border">
              <DropdownMenuItem className="text-gray-300 hover:text-white focus:text-white">
                <Save className="w-4 h-4 mr-2" />
                Save
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 hover:text-white focus:text-white">
                <Share className="w-4 h-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 hover:text-white focus:text-white">
                <Download className="w-4 h-4 mr-2" />
                Export
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="px-3 py-1 rounded-full bg-cardshow-mediumGray/50 text-sm text-cardshow-lightGray hidden md:flex items-center">
          {autoSaveStatus === 'saving' ? 'Auto saving' : 'Saved'} 
          <span className={`inline-block w-2 h-2 ml-1 rounded-full ${
            autoSaveStatus === 'saving' ? 'bg-cardshow-orange animate-pulse' : 'bg-cardshow-green'
          }`}></span>
        </div>
        
        <TooltipProvider delayDuration={300}>
          <div className="hidden md:flex items-center space-x-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" className="text-gray-400 hover:text-white" size="sm">
                  <Save className="w-5 h-5 mr-2" />
                  Save
                </Button>
              </TooltipTrigger>
              <TooltipContent>Save your work</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" className="text-gray-400 hover:text-white" size="sm">
                  <Share className="w-5 h-5 mr-2" />
                  Share
                </Button>
              </TooltipTrigger>
              <TooltipContent>Share with others</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" className="text-gray-400 hover:text-white" size="sm">
                  <Download className="w-5 h-5 mr-2" />
                  Export
                </Button>
              </TooltipTrigger>
              <TooltipContent>Export your card</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                className="text-gray-400 hover:text-white p-2" 
                size="icon"
                onClick={toggleTheme}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle theme</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className="text-gray-400 hover:text-white p-2" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Settings</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Button variant="default" className="bg-cardshow-orange hover:bg-cardshow-orange/90 ml-2 rounded-full">
          Publish
        </Button>
      </div>
    </div>
  );
};
