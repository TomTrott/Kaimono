import { ArrowRight, Sparkles, Shield, Truck, Star } from 'lucide-react';

interface HeroProps {
  onShopNow: () => void;
  onExplore: () => void;
}

export function Hero({ onShopNow, onExplore }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-zinc-950">
      {/* Background gradient effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-red-600/15 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Nouvelles arrivages chaque semaine
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
            Les meilleures figurines
            <span className="block bg-gradient-to-r from-orange-400 via-amber-400 to-red-500 bg-clip-text text-transparent">
              Dragon Ball Z & Manga
            </span>
          </h1>

          <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Collectionnez vos héros préférés. Figurines officielles haute
            qualité, pièces d'édition limitée et nouveautés manga en stock.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onShopNow}
              className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold text-base hover:shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02] transition-all"
            >
              Découvrir le catalogue
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onExplore}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-zinc-900 border border-zinc-700 text-white font-semibold text-base hover:bg-zinc-800 hover:border-zinc-600 transition-all"
            >
              Nouveautés
            </button>
          </div>

          {/* Trust badges */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                <Shield className="w-5 h-5 text-orange-400" />
              </div>
              <p className="text-sm font-semibold text-white">Produits officiels</p>
              <p className="text-xs text-zinc-500">100% authentiques</p>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                <Truck className="w-5 h-5 text-orange-400" />
              </div>
              <p className="text-sm font-semibold text-white">Livraison 48h</p>
              <p className="text-xs text-zinc-500">Partout en France</p>
            </div>
            <div className="flex flex-col items-center gap-2 text-center col-span-2 md:col-span-1">
              <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                <Star className="w-5 h-5 text-orange-400" />
              </div>
              <p className="text-sm font-semibold text-white">4.8/5 avis</p>
              <p className="text-xs text-zinc-500">+1200 clients satisfaits</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
