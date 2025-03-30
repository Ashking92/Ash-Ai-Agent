
import { Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-black/80 text-blue-200 py-4 text-center text-sm border-t border-blue-500/30">
      <div className="container mx-auto px-4 flex items-center justify-center">
        <p className="flex items-center gap-1">
          © {new Date().getFullYear()} Ash <Heart size={14} className="text-blue-400 animate-pulse" /> Made with intelligence
        </p>
      </div>
    </footer>
  );
};
