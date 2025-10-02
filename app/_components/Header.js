import React from 'react';
import { Menu, User, Settings } from 'lucide-react';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full bg-gradient-to-r from-purple-800 to-indigo-800 text-white shadow-lg p-4 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
            <button
            type="button"
            className="lg:hidden p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-white/60"
            aria-label="Open navigation"
            >
              <Menu className="h-6 w-6" />
            </button>
          <h1 className="text-2xl font-bold tracking-wide">BookWrite</h1>
        </div>
        <nav className="hidden lg:flex space-x-6">
          <a href="#" className="hover:text-purple-200 transition-colors duration-200">Dashboard</a>
          <a href="#" className="hover:text-purple-200 transition-colors duration-200">My Books</a>
          <a href="#" className="hover:text-purple-200 transition-colors duration-200">Templates</a>
          <a href="#" className="hover:text-purple-200 transition-colors duration-200">Help</a>
        </nav>
        <div className="flex items-center space-x-4">
          <button
            type="button"
            className="p-1 rounded-md hover:text-purple-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/60"
            aria-label="Open settings"
          >
            <Settings className="h-6 w-6" />
          </button>
          <button
            type="button"
            className="p-1 rounded-md hover:text-purple-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/60"
            aria-label="Account"
          >
            <User className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
