import { Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-black border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/assets/images/Kaimono-logo.png"
                alt="Kaimono Store Logo"
                className="h-8 w-auto"
              />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Votre boutique spécialisée dans les figurines Dragon Ball Z et
              manga. Produits officiels et édition limitée.
            </p>
            <div className="flex gap-2">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-black border border-gray-200 flex items-center justify-center text-gray-400   hover:text-[#EE9D34] hover:border-[#EE9D34]/30 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-black border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#EE9D34] hover:border-[#EE9D34]/30 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-[#EE9D34]  font-semibold text-sm mb-4">Boutique</h3>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-400 hover:text-[#EE9D34] transition-colors"
                >
                  Dragon Ball Z
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-400 hover:text-[#EE9D34] transition-colors"
                >
                  Naruto
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-400 hover:text-[#EE9D34] transition-colors"
                >
                  One Piece
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-400 hover:text-[#EE9D34] transition-colors"
                >
                  Demon Slayer
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-400 hover:text-[#EE9D34] transition-colors"
                >
                  Nouveautés
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[#EE9D34] font-semibold text-sm mb-4">Aide</h3>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-400 hover:text-[#EE9D34] transition-colors"
                >
                  Livraison
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-400 hover:text-[#EE9D34] transition-colors"
                >
                  Retours
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-400 hover:text-[#EE9D34] transition-colors"
                >
                  CGV
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-400 hover:text-[#EE9D34] transition-colors"
                >
                  Mentions légales
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[#EE9D34] font-semibold text-sm mb-4">Contact</h3>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#EE9D34] transition-colors">
                <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                contact-kaimono-store@gmail.com
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#EE9D34] transition-colors">
                <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                Sur demande de contact
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#EE9D34] transition-colors">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                France, Barbezieux-Saint-Hilaire
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            © 2026 KAIMONO Store. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400">Paiement sécurisé</span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-400">Livraison 48h</span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-400 ">Produits officiels</span>
          </div>
        </div>
      </div>
    </footer>
  );
}