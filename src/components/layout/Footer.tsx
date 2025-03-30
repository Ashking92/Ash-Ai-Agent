
import { Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-purple-900/80 to-indigo-900/80 text-purple-100 py-4 text-center text-sm">
      <div className="container mx-auto px-4 flex items-center justify-center">
        <p className="flex items-center gap-1">
          © {new Date().getFullYear()} दादी माँ AI <Heart size={14} className="text-pink-400 animate-pulse" /> Made with love
        </p>
      </div>
    </footer>
  );
};
