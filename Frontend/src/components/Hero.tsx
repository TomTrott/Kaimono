import { ArrowRight, Sparkles, Shield, Truck, Star } from 'lucide-react';

interface HeroProps {
  onShopNow: () => void;
  onExplore: () => void;
}

export function Hero({ onShopNow, onExplore }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gray-50">
      {/* Background gradient effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[500px] bg-[#EE9D34]/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-red-200/50 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-amber-200/20 rounded-full blur-[120px]" />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            'linear-gradient(to right, black 1px, transparent 1px), linear-gradient(to bottom, black 1px, transparent 1px)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="mt-8 text-4xl sm:text-5xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1]">
            Les meilleures figurines
            <span className="block bg-gradient-to-r from-orange-500 via-[#EE9D34] to-orange-600 bg-clip-text text-transparent">
              Dragon Ball Z & Manga
            </span>
          </h1>

          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Collectionnez vos héros préférés. <br />
            Figurines officielles Banpresto, Bandai et autres.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onShopNow}
              className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-orange-500 via-[#EE9D34] to-orange-600 text-white font-semibold text-base hover:shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02] transition-all"
            >
              Découvrir le catalogue
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onExplore}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gray-100 border border-gray-200 text-gray-900 font-semibold text-base hover:bg-gray-200 hover:border-gray-300 transition-all"
            >
              Nouveautés
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}