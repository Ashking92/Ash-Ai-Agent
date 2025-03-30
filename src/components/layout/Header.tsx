
import { Link } from 'react-router-dom';

export const Header = () => {
  return (
    <header className="bg-gradient-to-r from-purple-900/80 to-indigo-900/80 backdrop-blur-md py-4 fixed top-0 left-0 right-0 z-10">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent">
            दादी माँ AI
          </span>
        </Link>
      </div>
    </header>
  );
};
