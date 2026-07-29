import { Flame, Instagram, Twitter, Facebook, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                <Flame className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <div className="leading-none">
                <span className="block text-white font-extrabold text-base">
                  KAIMONO
                </span>
                <span className="block text-orange-400 text-[9px] font-semibold tracking-[0.2em] uppercase">
                  Store
                </span>
              </div>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed mb-4">
              Votre boutique spécialisée dans les figurines Dragon Ball Z et
              manga. Produits officiels et édition limitée.
            </p>
            <div className="flex gap-2">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-orange-400 hover:border-orange-500/30 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-orange-400 hover:border-orange-500/30 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-orange-400 hover:border-orange-500/30 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Boutique</h3>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-sm text-zinc-500 hover:text-orange-400 transition-colors">Dragon Ball Z</a></li>
              <li><a href="#" className="text-sm text-zinc-500 hover:text-orange-400 transition-colors">Naruto</a></li>
              <li><a href="#" className="text-sm text-zinc-500 hover:text-orange-400 transition-colors">One Piece</a></li>
              <li><a href="#" className="text-sm text-zinc-500 hover:text-orange-400 transition-colors">Demon Slayer</a></li>
              <li><a href="#" className="text-sm text-zinc-500 hover:text-orange-400 transition-colors">Nouveautés</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Aide</h3>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-sm text-zinc-500 hover:text-orange-400 transition-colors">Livraison</a></li>
              <li><a href="#" className="text-sm text-zinc-500 hover:text-orange-400 transition-colors">Retours</a></li>
              <li><a href="#" className="text-sm text-zinc-500 hover:text-orange-400 transition-colors">FAQ</a></li>
              <li><a href="#" className="text-sm text-zinc-500 hover:text-orange-400 transition-colors">CGV</a></li>
              <li><a href="#" className="text-sm text-zinc-500 hover:text-orange-400 transition-colors">Mentions légales</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Contact</h3>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2 text-sm text-zinc-500">
                <Mail className="w-4 h-4 text-zinc-600 shrink-0" />
                contact@kaimono-store.fr
              </li>
              <li className="flex items-center gap-2 text-sm text-zinc-500">
                <Phone className="w-4 h-4 text-zinc-600 shrink-0" />
                01 23 45 67 89
              </li>
              <li className="flex items-center gap-2 text-sm text-zinc-500">
                <MapPin className="w-4 h-4 text-zinc-600 shrink-0" />
                Paris, France
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600">
            © 2026 KAIMONO Store. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-zinc-600">Paiement sécurisé</span>
            <span className="text-xs text-zinc-600">•</span>
            <span className="text-xs text-zinc-600">Livraison 48h</span>
            <span className="text-xs text-zinc-600">•</span>
            <span className="text-xs text-zinc-600">Produits officiels</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
