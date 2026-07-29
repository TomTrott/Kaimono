import { useState } from 'react';
import { ShoppingBag, Search, Menu, X, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

interface HeaderProps {
  onCartClick: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onLogoClick: () => void;
}

export function Header({
  onCartClick,
  searchQuery,
  onSearchChange,
  onLogoClick,
}: HeaderProps) {
  const { totalItems } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Liens de navigation
  const navLinks = [
    { label: 'Accueil', path: '/' },
    { label: 'Boutique', path: '/boutique' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleProfileClick = () => {
    setMobileOpen(false);
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      navigate('/login', { state: { from: '/profile' } });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <button
            onClick={onLogoClick}
            className="flex items-center gap-2 shrink-0 group"
          >
            <img
              src="/assets/images/Kaimono-store-logo.png"
              alt="Kaimono Store Logo"
              className="h-9 w-auto"
            />
          </button>

          {/* Search bar (desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Rechercher une figurine, un personnage..."
                className="w-full bg-gray-100 border border-gray-200 rounded-full pl-10 pr-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#EE9D34]/50 focus:ring-1 focus:ring-[#EE9D34]/30 transition-colors"
              />
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-full transition-all text-gray-600 hover:text-[#EE9D34]"
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={onCartClick}
              className="relative p-2 rounded-lg text-gray-600 hover:text-[#EE9D34] "
              aria-label="Panier"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#EE9D34] text-white text-[10px] font-bold flex items-center justify-center animate-in fade-in zoom-in">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              onClick={handleProfileClick}
              className="p-2 rounded-lg text-gray-600 hover:text-[#EE9D34] "
              aria-label="Profil"
            >
              <User className="w-5 h-5" />
            </button>
          </nav>

          {/* Cart + mobile menu button */}
          <div className="flex items-center gap-2 shrink-0 lg:hidden">
            <button
              onClick={onCartClick}
              className="relative p-2 rounded-lg text-gray-600 hover:text-[#EE9D34] "
              aria-label="Panier"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#EE9D34] text-white text-[10px] font-bold flex items-center justify-center animate-in fade-in zoom-in">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-[#EE9D34] "
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden pb-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Rechercher..."
                className="w-full bg-gray-100 border border-gray-200 rounded-full pl-10 pr-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#EE9D34]/50 focus:ring-1 focus:ring-[#EE9D34]/30 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-full transition-all text-gray-600 hover:text-[#EE9D34] hover:bg-[#EE9D34]/10"
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={handleProfileClick}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-full transition-all text-gray-600 hover:text-[#EE9D34] hover:bg-[#EE9D34]/10 text-left"
              >
                Profil
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}