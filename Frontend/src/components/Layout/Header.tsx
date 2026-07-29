import { useState } from 'react';
import { ShoppingBag, Search, Menu, X, Flame } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface HeaderProps {
  onCartClick: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onCategorySelect: (cat: string) => void;
  activeCategory: string;
  categories: string[];
  onLogoClick: () => void;
}

export function Header({
  onCartClick,
  searchQuery,
  onSearchChange,
  onCategorySelect,
  activeCategory,
  categories,
  onLogoClick,
}: HeaderProps) {
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <button
            onClick={onLogoClick}
            className="flex items-center gap-2 shrink-0 group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500 blur-lg opacity-50 group-hover:opacity-70 transition-opacity" />
              <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                <Flame className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <div className="text-left leading-none">
              <span className="block text-white font-extrabold text-lg tracking-tight">
                KAIMONO
              </span>
              <span className="block text-orange-400 text-[10px] font-semibold tracking-[0.2em] uppercase">
                Store
              </span>
            </div>
          </button>

          {/* Search bar (desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Rechercher une figurine, un personnage..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-full pl-10 pr-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 transition-colors"
              />
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onCategorySelect(cat)}
                className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all ${
                  activeCategory === cat
                    ? 'bg-orange-500 text-white'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </nav>

          {/* Cart + mobile menu */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onCartClick}
              className="relative p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
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
              className="lg:hidden p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
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
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Rechercher..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-full pl-10 pr-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500/50"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    onCategorySelect(cat);
                    setMobileOpen(false);
                  }}
                  className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all ${
                    activeCategory === cat
                      ? 'bg-orange-500 text-white'
                      : 'bg-zinc-900 text-zinc-300 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
