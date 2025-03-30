
import { Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-black text-gray-500 py-4 text-center text-sm">
      <div className="container mx-auto px-4 flex items-center justify-center">
        <p className="flex items-center gap-1">
          © {new Date().getFullYear()} Ash <Heart size={14} className="text-white" /> Made with intelligence
        </p>
      </div>
    </footer>
  );
};
