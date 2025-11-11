
import React from 'react';
import { SparklesIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-center items-center">
            <SparklesIcon className="w-6 h-6 text-teal-400 mr-2" />
            <h1 className="text-xl font-bold tracking-wider text-gray-100 uppercase">
              InkedIn
            </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
