
import { Link } from 'react-router-dom';

export const Header = () => {
  return (
    <header className="bg-black py-4 fixed top-0 left-0 right-0 z-10">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-white">
            Ash
          </span>
        </Link>
      </div>
    </header>
  );
};
