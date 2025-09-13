import React from 'react';
import { motion } from 'framer-motion';

const Navbar = ({ currentPage, setCurrentPage }) => {
  const navItems = [
    { name: 'Home', page: 'home' },
    { name: 'Dashboard', page: 'dashboard' },
    { name: 'About', page: 'about' }
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => setCurrentPage('home')}
          >
            <div className="text-2xl font-bold text-gray-900">
              Note<span className="text-blue-600">Flow</span>
            </div>
          </motion.div>

          {/* Nav Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <motion.button
                  key={item.page}
                  onClick={() => setCurrentPage(item.page)}
                  className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    currentPage === item.page
                      ? 'text-blue-600'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                  whileHover={{ y: -2 }}
                >
                  {item.name}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
