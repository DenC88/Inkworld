
import React, { useState } from 'react';
import { AppView } from './types';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Feed from './components/Feed';
import Explore from './components/Explore';
import AIAssistant from './components/AIAssistant';
import Profile from './components/Profile';
import ChatBot from './components/ChatBot';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('feed');

  const renderView = () => {
    switch (currentView) {
      case 'feed':
        return <Feed />;
      case 'explore':
        return <Explore />;
      case 'ai_assistant':
        return <AIAssistant />;
      case 'profile':
        return <Profile />;
      default:
        return <Feed />;
    }
  };

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen font-sans flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-4 md:py-8 mb-16">
        {renderView()}
      </main>
      <ChatBot />
      <BottomNav currentView={currentView} setCurrentView={setCurrentView} />
    </div>
  );
};

export default App;
