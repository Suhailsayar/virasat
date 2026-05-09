import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Leaf } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { artisan, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-earth shadow-warm-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-saffron rounded-sm flex items-center justify-center
                          group-hover:bg-saffron-light transition-colors">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-display text-cream text-lg leading-none block">Virasat</span>
            <span className="font-body text-gold text-[10px] tracking-[0.2em] uppercase leading-none block">Connect</span>
          </div>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-4">
          {artisan ? (
            <>
              <Link to="/dashboard"
                className="flex items-center gap-2 text-cream/80 hover:text-cream
                           font-body text-sm tracking-wide transition-colors">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">{artisan.name.split(' ')[0]}</span>
              </Link>
              <button onClick={handleLogout}
                className="flex items-center gap-2 text-cream/60 hover:text-saffron-light
                           font-body text-sm tracking-wide transition-colors">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login"
                className="text-cream/80 hover:text-cream font-body text-sm tracking-wide transition-colors">
                Login
              </Link>
              <Link to="/register"
                className="bg-saffron hover:bg-saffron-light text-white font-body text-sm
                           font-bold px-4 py-2 rounded-sm tracking-wide transition-colors">
                Join as Artisan
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
