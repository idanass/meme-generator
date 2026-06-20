import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{ backgroundColor: '#1a237e' }} className="px-6 py-3 flex items-center gap-8">
      <Link to="/" className="flex items-center gap-1">
        <span className="text-orange-500 font-black text-xl">Meme</span>
        <span className="text-white font-black text-xl">Hub</span>
      </Link>
      <Link to="/gallery" className="text-white text-sm font-medium hover:text-orange-400 transition-colors">
        GALERIE
      </Link>
      <Link to="/" className="text-white text-sm font-medium hover:text-orange-400 transition-colors">
        MON COMPTE
      </Link>
    </nav>
  );
};

export default Navbar;