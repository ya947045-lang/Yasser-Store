import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              ElectroTech
            </h3>
            <p className="text-gray-400 text-sm">
              Your premier destination for cutting-edge electronics.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white text-sm">Home</Link></li>
              <li><Link to="/shop" className="text-gray-400 hover:text-white text-sm">Shop</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white text-sm">About</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li><Link to="/shop?category=smartphones" className="text-gray-400 hover:text-white text-sm">Smartphones</Link></li>
              <li><Link to="/shop?category=laptops" className="text-gray-400 hover:text-white text-sm">Laptops</Link></li>
              <li><Link to="/shop?category=audio" className="text-gray-400 hover:text-white text-sm">Audio</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>123 Tech Street, CA</li>
              <li>+1 (555) 123-4567</li>
              <li>support@electrotech.com</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} ElectroTech. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
