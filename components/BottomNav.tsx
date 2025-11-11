
import React from 'react';
import { AppView } from '../types';
import { HomeIcon, CompassIcon, SparklesIcon, UserIcon } from './icons';

interface BottomNavProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
}

const NavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
    const activeClass = isActive ? 'text-teal-400' : 'text-gray-400';
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-center w-full transition-colors duration-200 hover:text-teal-300 ${activeClass}`}
        >
            {icon}
            <span className="text-xs mt-1">{label}</span>
        </button>
    );
};

const BottomNav: React.FC<BottomNavProps> = ({ currentView, setCurrentView }) => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-sm border-t border-gray-700 z-50">
      <div className="container mx-auto px-4 h-16 flex justify-around items-center">
        <NavItem 
            icon={<HomeIcon className="w-6 h-6" />}
            label="Feed"
            isActive={currentView === 'feed'}
            onClick={() => setCurrentView('feed')}
        />
        <NavItem 
            icon={<CompassIcon className="w-6 h-6" />}
            label="Explore"
            isActive={currentView === 'explore'}
            onClick={() => setCurrentView('explore')}
        />
        <NavItem 
            icon={<SparklesIcon className="w-6 h-6" />}
            label="AI"
            isActive={currentView === 'ai_assistant'}
            onClick={() => setCurrentView('ai_assistant')}
        />
        <NavItem 
            icon={<UserIcon className="w-6 h-6" />}
            label="Profile"
            isActive={currentView === 'profile'}
            onClick={() => setCurrentView('profile')}
        />
      </div>
    </footer>
  );
};

export default BottomNav;
