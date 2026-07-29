import { ArrowRight, Sparkles, Shield, Truck, Star } from 'lucide-react';

interface HeroProps {
  onShopNow: () => void;
  onExplore: () => void;
}

export function Hero({ onShopNow, onExplore }: HeroProps) {
  const productImages = [
    "https://via.placeholder.com/300x200/FF5733/FFFFFF?text=Product+1",
    "https://via.placeholder.com/300x200/33FF57/FFFFFF?text=Product+2",
    "https://via.placeholder.com/300x200/3357FF/FFFFFF?text=Product+3",
    "https://via.placeholder.com/300x200/F1C40F/FFFFFF?text=Product+4",
    "https://via.placeholder.com/300x200/9C27B0/FFFFFF?text=Product+5",
    "https://via.placeholder.com/300x200/FF9800/FFFFFF?text=Product+6",
  ];

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background gradient effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[500px] bg-orange-200/60 rounded-full blur-[120px]" />
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
            <span className="block bg-gradient-to-r from-orange-500 via-amber-500 to-red-600 bg-clip-text text-transparent">
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
              className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold text-base hover:shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02] transition-all"
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

      {/* Bandeau défilant de produits */}
<div className="relative w-full h-32 overflow-hidden bg-gray-50 border-t border-gray-200">
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="flex space-x-6 animate-scroll-loop">
      {/* Première série d'images */}
      {productImages.map((src, index) => (
        <div
          key={index}
          className="flex-shrink-0 w-40 h-24 rounded-lg overflow-hidden shadow-md"
        >
          <img
            src={src}
            alt={`Produit ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
      {/* Deuxième série d'images (identique) pour la boucle */}
      {productImages.map((src, index) => (
        <div
          key={`loop-${index}`}
          className="flex-shrink-0 w-40 h-24 rounded-lg overflow-hidden shadow-md"
        >
          <img
            src={src}
            alt={`Produit ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  </div>
</div>
    </section>
  );
}