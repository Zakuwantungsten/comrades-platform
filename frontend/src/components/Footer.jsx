import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-blue-700 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/about" className="hover:text-blue-300">About Us</a></li>
              <li><a href="/services" className="hover:text-blue-300">Services</a></li>
              <li><a href="/contact" className="hover:text-blue-300">Contact</a></li>
              <li><a href="/faq" className="hover:text-blue-300">FAQ</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Info</h3>
            <ul className="space-y-2">
              <li>Email: support@comrades.com</li>
              <li>Phone: +254 700 000 000</li>
              <li>Address: 123 University Way, Nairobi</li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-bold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-300">
                <FaFacebook className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-blue-300">
                <FaTwitter className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-blue-300">
                <FaInstagram className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-blue-300">
                <FaLinkedin className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Legal Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="/privacy" className="hover:text-blue-300">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-blue-300">Terms of Service</a></li>
              <li><a href="/cookies" className="hover:text-blue-300">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-blue-600 pt-6 text-center">
          <p>&copy; {new Date().getFullYear()} Comrades Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
