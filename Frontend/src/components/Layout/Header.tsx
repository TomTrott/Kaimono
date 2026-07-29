import { useState } from 'react';
import { ShoppingBag, Search, Menu, X, Flame, User, Home, Sparkles, Store } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Link } from 'react-router-dom';

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
  const [mobileOpen, setMobileOpen] = useState(false);

  // Liens de navigation
  const navLinks = [
    { label: 'Accueil', path: '/' },
    { label: 'Boutique', path: '/boutique' },
    { label: 'Contact', icon: null, path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <button
            onClick={onLogoClick}
            className="flex items-center gap-2 shrink-0 group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500 blur-lg opacity-30 group-hover:opacity-40 transition-opacity" />
              <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                <Flame className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <div className="text-left leading-none">
              <span className="block text-gray-900 font-extrabold text-lg tracking-tight">
                KAIMONO
              </span>
              <span className="block text-orange-500 text-[10px] font-semibold tracking-[0.2em] uppercase">
                Store
              </span>
            </div>
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
                className="w-full bg-gray-100 border border-gray-200 rounded-full pl-10 pr-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 transition-colors"
              />
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-full transition-all text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
            <button
              onClick={onCartClick}
              className="relative p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              aria-label="Panier"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center animate-in fade-in zoom-in">
                  {totalItems}
                </span>
              )}
            </button>
            <Link
              to="/profile"
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              aria-label="Profil"
            >
              <User className="w-5 h-5" />
            </Link>
          </nav>

          {/* Cart + mobile menu button */}
          <div className="flex items-center gap-2 shrink-0 lg:hidden">
            <button
              onClick={onCartClick}
              className="relative p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              aria-label="Panier"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center animate-in fade-in zoom-in">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
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
                className="w-full bg-gray-100 border border-gray-200 rounded-full pl-10 pr-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500/50"
              />
            </div>
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-full transition-all text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
              <Link
                to="/profile"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-full transition-all text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
               
                Profil
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}