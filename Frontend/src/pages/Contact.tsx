import { useState } from 'react';
import {
  Send,
  Loader2,
  Sparkles,
  ChevronDown,
  User,
  Mail,
  MessageSquare,
  Package,
  CheckCircle2,
  Clock,
  MapPin,
} from 'lucide-react';

// Raisons de contact
const CONTACT_REASONS = [
  { value: '', label: 'Sélectionner une raison' },
  { value: 'informations', label: 'Informations' },
  { value: 'retours', label: 'Retours' },
  { value: 'livraisons', label: 'Livraisons' },
] as const;

// Raisons de retour (affichées uniquement si "Retours" est sélectionné)
const RETURN_REASONS = [
  { value: '', label: 'Sélectionner une raison' },
  { value: 'defaut', label: 'Défaut de produit' },
  { value: 'casse', label: 'Casse' },
  { value: 'autres', label: 'Autres' },
] as const;

type ContactReason = (typeof CONTACT_REASONS)[number]['value'];
type ReturnReason = (typeof RETURN_REASONS)[number]['value'];

interface FormErrors {
  prenom?: string;
  nom?: string;
  email?: string;
  reason?: string;
  orderNumber?: string;
  returnReason?: string;
  message?: string;
}

export default function Contact() {
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState<ContactReason>('');
  const [orderNumber, setOrderNumber] = useState('');
  const [returnReason, setReturnReason] = useState<ReturnReason>('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const isRetours = reason === 'retours';
  const isAutreRetour = isRetours && returnReason === 'autres';

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const validate = (): boolean => {
    const next: FormErrors = {};

    if (!prenom.trim()) next.prenom = 'Le prénom est requis.';
    if (!nom.trim()) next.nom = 'Le nom est requis.';
    if (!email.trim()) {
      next.email = "L'email est requis.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = 'Format email invalide.';
    }
    if (!reason) next.reason = 'Merci de sélectionner une raison.';

    if (isRetours) {
      if (!orderNumber.trim()) next.orderNumber = 'Le numéro de commande est requis.';
      if (!returnReason) next.returnReason = 'Merci de préciser la raison du retour.';
    }

    if (!message.trim()) next.message = 'Le message est requis.';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    // TODO: Remplacer par ta propre logique d'envoi (API, email, etc.)
    await new Promise((resolve) => setTimeout(resolve, 900));
    setSubmitting(false);
    setSubmitted(true);
    showToast('Message envoyé avec succès');
  };

  const handleReasonChange = (value: ContactReason) => {
    setReason(value);
    setErrors((prev) => ({ ...prev, reason: undefined }));
    if (value !== 'retours') {
      setOrderNumber('');
      setReturnReason('');
    }
  };

  const resetForm = () => {
    setPrenom('');
    setNom('');
    setEmail('');
    setReason('');
    setOrderNumber('');
    setReturnReason('');
    setMessage('');
    setErrors({});
    setSubmitted(false);
  };

  const inputBase =
    'w-full bg-gray-50 border rounded-2xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors';
  const inputOk = 'border-gray-200 focus:border-[#EE9D34]/50 focus:ring-[#EE9D34]/30';
  const inputErr = 'border-red-300 focus:border-red-400 focus:ring-red-200';

  return (
    <div className="relative overflow-hidden bg-gray-50">
      {/* Décor d'arrière-plan */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#EE9D34]/10 blur-3xl" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 rounded-full bg-[#EE9D34]/5 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* En-tête */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EE9D34]/10 text-[#EE9D34] text-xs font-semibold tracking-wide uppercase mb-4">
            On est là pour vous aider
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Une question ? Écrivez-nous.
          </h1>
          <p className="text-sm text-gray-500 mt-3">
            Commande, livraison, retour ou simple curiosité — notre équipe vous répond
            rapidement, avec le sourire.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,320px)_1fr] gap-8 items-start">
          {/* Colonne info */}
          <div className="space-y-4 lg:sticky lg:top-8">
            <div className="rounded-3xl bg-black text-white p-7">
              <h2 className="text-base font-semibold mb-5">Nous contacter</h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-[#EE9D34]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="text-sm font-medium">contact@boutique.fr</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-[#EE9D34]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Délai de réponse</p>
                    <p className="text-sm font-medium">Sous 24 à 48h ouvrées</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-[#EE9D34]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Basé en</p>
                    <p className="text-sm font-medium">France, Barbezieux-Saint-Hilaire</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-white/10 flex items-center gap-2 text-sm text-gray-400">
                Merci de faire partie de la communauté !
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 p-6">
              <p className="text-sm font-medium text-gray-700 mb-1">Retour de commande ?</p>
              <p className="text-sm text-gray-500 leading-relaxed">
                Gardez votre numéro de commande à portée de main pour un traitement plus rapide.
              </p>
            </div>
          </div>

          {/* Colonne formulaire */}
          <div className="rounded-3xl border border-gray-200 bg-white shadow-sm shadow-gray-100 p-6 sm:p-8">
            {submitted ? (
              <div className="text-center py-16 px-6">
                <div className="w-14 h-14 rounded-full bg-[#EE9D34]/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-7 h-7 text-[#EE9D34]" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Merci, {prenom} !</h2>
                <p className="text-sm text-gray-500 mb-6">
                  Votre message a bien été envoyé. Notre équipe revient vers vous sous peu.
                </p>
                <button
                  onClick={resetForm}
                  className="px-6 py-2.5 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                {/* Nom / Prénom */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="prenom" className="block text-xs font-medium text-gray-700 mb-1.5">
                      Prénom
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        id="prenom"
                        type="text"
                        value={prenom}
                        onChange={(e) => {
                          setPrenom(e.target.value);
                          setErrors((prev) => ({ ...prev, prenom: undefined }));
                        }}
                        placeholder="Votre prénom"
                        className={`${inputBase} ${errors.prenom ? inputErr : inputOk} pl-9`}
                      />
                    </div>
                    {errors.prenom && <p className="text-xs text-red-500 mt-1">{errors.prenom}</p>}
                  </div>

                  <div>
                    <label htmlFor="nom" className="block text-xs font-medium text-gray-700 mb-1.5">
                      Nom
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        id="nom"
                        type="text"
                        value={nom}
                        onChange={(e) => {
                          setNom(e.target.value);
                          setErrors((prev) => ({ ...prev, nom: undefined }));
                        }}
                        placeholder="Votre nom"
                        className={`${inputBase} ${errors.nom ? inputErr : inputOk} pl-9`}
                      />
                    </div>
                    {errors.nom && <p className="text-xs text-red-500 mt-1">{errors.nom}</p>}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrors((prev) => ({ ...prev, email: undefined }));
                      }}
                      placeholder="vous@exemple.com"
                      className={`${inputBase} ${errors.email ? inputErr : inputOk} pl-9`}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>

                {/* Raison du contact */}
                <div>
                  <label htmlFor="reason" className="block text-xs font-medium text-gray-700 mb-1.5">
                    Raison du contact
                  </label>
                  <div className="relative">
                    <select
                      id="reason"
                      value={reason}
                      onChange={(e) => handleReasonChange(e.target.value as ContactReason)}
                      className={`${inputBase} ${errors.reason ? inputErr : inputOk} appearance-none pr-8 cursor-pointer`}
                    >
                      {CONTACT_REASONS.map((opt) => (
                        <option key={opt.value} value={opt.value} disabled={opt.value === ''}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                  {errors.reason && <p className="text-xs text-red-500 mt-1">{errors.reason}</p>}
                </div>

                {/* Bloc conditionnel : Retours */}
                {isRetours && (
                  <div className="rounded-2xl border border-[#EE9D34]/30 bg-[#EE9D34]/5 p-5 space-y-5">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                      <Package className="w-4 h-4 text-[#EE9D34]" />
                      Détails du retour
                    </div>

                    <div>
                      <label htmlFor="orderNumber" className="block text-xs font-medium text-gray-700 mb-1.5">
                        Numéro de commande
                      </label>
                      <input
                        id="orderNumber"
                        type="text"
                        value={orderNumber}
                        onChange={(e) => {
                          setOrderNumber(e.target.value);
                          setErrors((prev) => ({ ...prev, orderNumber: undefined }));
                        }}
                        placeholder="Ex. CMD-2026-00123"
                        className={`${inputBase} ${errors.orderNumber ? inputErr : inputOk} bg-white`}
                      />
                      {errors.orderNumber && (
                        <p className="text-xs text-red-500 mt-1">{errors.orderNumber}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="returnReason" className="block text-xs font-medium text-gray-700 mb-1.5">
                        Raison du retour
                      </label>
                      <div className="relative">
                        <select
                          id="returnReason"
                          value={returnReason}
                          onChange={(e) => {
                            setReturnReason(e.target.value as ReturnReason);
                            setErrors((prev) => ({ ...prev, returnReason: undefined }));
                          }}
                          className={`${inputBase} ${errors.returnReason ? inputErr : inputOk} appearance-none pr-8 cursor-pointer bg-white`}
                        >
                          {RETURN_REASONS.map((opt) => (
                            <option key={opt.value} value={opt.value} disabled={opt.value === ''}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                      {errors.returnReason && (
                        <p className="text-xs text-red-500 mt-1">{errors.returnReason}</p>
                      )}
                      {isAutreRetour && (
                        <p className="text-xs text-gray-500 mt-1.5">
                          Merci de préciser votre demande dans le message ci-dessous.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-xs font-medium text-gray-700 mb-1.5">
                    Message
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3.5 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                    <textarea
                      id="message"
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        setErrors((prev) => ({ ...prev, message: undefined }));
                      }}
                      rows={5}
                      placeholder={
                        isAutreRetour
                          ? 'Expliquez-nous la raison de votre retour...'
                          : 'Votre message...'
                      }
                      className={`${inputBase} ${errors.message ? inputErr : inputOk} pl-9 pt-2.5 resize-none rounded-2xl`}
                    />
                  </div>
                  {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
                </div>

                {/* Submit */}
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Envoi...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Envoyer le message
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] px-6 py-3 rounded-full bg-gray-900 border border-gray-700 text-white text-sm font-medium shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4">
          <Sparkles className="w-4 h-4 text-[#EE9D34]" />
          {toast}
        </div>
      )}
    </div>
  );
}