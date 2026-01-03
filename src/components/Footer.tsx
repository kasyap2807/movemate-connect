import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Truck className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">MoveMate</span>
            </Link>
            <p className="text-background/70 text-sm">
              Your trusted partner for seamless packing and moving services. Connect with verified professionals today.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 rounded-lg bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/search" className="text-background/70 hover:text-primary text-sm transition-colors">Find Services</Link></li>
              <li><Link to="/how-it-works" className="text-background/70 hover:text-primary text-sm transition-colors">How It Works</Link></li>
              <li><Link to="/auth?mode=signup&role=provider" className="text-background/70 hover:text-primary text-sm transition-colors">Become a Provider</Link></li>
              <li><Link to="/pricing" className="text-background/70 hover:text-primary text-sm transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link to="/help" className="text-background/70 hover:text-primary text-sm transition-colors">Help Center</Link></li>
              <li><Link to="/terms" className="text-background/70 hover:text-primary text-sm transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-background/70 hover:text-primary text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link to="/contact" className="text-background/70 hover:text-primary text-sm transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-background/70 text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                <span>123 Move Street, City 12345</span>
              </li>
              <li className="flex items-center gap-2 text-background/70 text-sm">
                <Phone className="w-4 h-4 text-primary" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2 text-background/70 text-sm">
                <Mail className="w-4 h-4 text-primary" />
                <span>hello@movemate.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-background/50 text-sm">
            © {new Date().getFullYear()} MoveMate. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/terms" className="text-background/50 hover:text-primary text-sm transition-colors">Terms</Link>
            <Link to="/privacy" className="text-background/50 hover:text-primary text-sm transition-colors">Privacy</Link>
            <Link to="/cookies" className="text-background/50 hover:text-primary text-sm transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
