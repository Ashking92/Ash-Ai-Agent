
import { Link } from 'react-router-dom';

export const Header = () => {
  return (
    <header className="bg-black/80 backdrop-blur-md py-4 fixed top-0 left-0 right-0 z-10 border-b border-blue-500/30">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            Ash
          </span>
        </Link>
      </div>
    </header>
  );
};
