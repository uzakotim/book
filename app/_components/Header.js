import React from 'react';
import { Menu, User, Settings } from 'lucide-react';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full bg-gradient-to-r from-purple-800 to-indigo-800 text-white shadow-lg p-4 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Menu className="h-6 w-6 cursor-pointer lg:hidden" />
          <h1 className="text-2xl font-bold tracking-wide">BookWrite</h1>
        </div>
        <nav className="hidden lg:flex space-x-6">
          <a href="#" className="hover:text-purple-200 transition-colors duration-200">Dashboard</a>
          <a href="#" className="hover:text-purple-200 transition-colors duration-200">My Books</a>
          <a href="#" className="hover:text-purple-200 transition-colors duration-200">Templates</a>
          <a href="#" className="hover:text-purple-200 transition-colors duration-200">Help</a>
        </nav>
        <div className="flex items-center space-x-4">
          <Settings className="h-6 w-6 cursor-pointer hover:text-purple-200 transition-colors duration-200" />
          <User className="h-6 w-6 cursor-pointer hover:text-purple-200 transition-colors duration-200" />
        </div>
      </div>
    </header>
  );
};

export default Header;
