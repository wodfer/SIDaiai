import React, { useState } from 'react';
import { AppProvider } from '@/contexts/AppContext';
import AppLayout from '@/components/AppLayout';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import MainContent from '@/components/MainContent';
import PlayerControls from '@/components/PlayerControls';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState('home');

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <AppProvider>
      <div className="h-screen bg-gray-50 flex overflow-hidden">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)}
          onNavigate={handleNavigate}
          currentView={currentView}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            onMenuClick={() => setSidebarOpen(!sidebarOpen)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          
          <main className="flex-1 overflow-auto">
            <MainContent 
              searchQuery={searchQuery} 
              currentView={currentView}
            />
          </main>
        </div>
        
        <PlayerControls />
      </div>
    </AppProvider>
  );
};

export default Index;