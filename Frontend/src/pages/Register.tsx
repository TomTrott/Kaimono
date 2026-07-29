import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Loader2, UserPlus, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface FormErrors {
  prenom?: string;
  nom?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  global?: string;
}

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const inputBase =
    'w-full bg-gray-50 border rounded-2xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors';
  const inputOk = 'border-gray-200 focus:border-[#EE9D34]/50 focus:ring-[#EE9D34]/30';
  const inputErr = 'border-red-300 focus:border-red-400 focus:ring-red-200';

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!prenom.trim()) next.prenom = 'Le prénom est requis.';
    if (!nom.trim()) next.nom = 'Le nom est requis.';
    if (!email.trim()) {
      next.email = "L'email est requis.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = 'Format email invalide.';
    }
    if (!password) {
      next.password = 'Le mot de passe est requis.';
    } else if (password.length < 8) {
      next.password = 'Minimum 8 caractères.';
    }
    if (confirmPassword !== password) {
      next.confirmPassword = 'Les mots de passe ne correspondent pas.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await register(prenom, nom, email, password);
      navigate('/profile', { replace: true });
    } catch {
      setErrors({ global: "Une erreur est survenue lors de l'inscription." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative overflow-hidden min-h-[calc(80vh-4rem)] bg-gray-50 flex items-center">
      {/* Décor d'arrière-plan */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#EE9D34]/10 blur-3xl" />
        <div className="absolute bottom-0 -left-32 w-80 h-80 rounded-full bg-[#EE9D34]/5 blur-3xl" />
      </div>

      <div className="max-w-md w-full mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EE9D34]/10 text-[#EE9D34] text-xs font-semibold tracking-wide uppercase mb-4">
            Rejoignez-nous
          </span>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Créer un compte</h1>
          <p className="text-sm text-gray-500 mt-2">
            Suivez vos commandes et retrouvez vos favoris en un clic.
          </p>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white shadow-sm shadow-gray-100 p-6 sm:p-8">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {errors.global && (
              <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-2.5 text-xs text-red-600">
                {errors.global}
              </div>
            )}

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

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  placeholder="8 caractères minimum"
                  className={`${inputBase} ${errors.password ? inputErr : inputOk} pl-9`}
                />
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-700 mb-1.5">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                  }}
                  placeholder="••••••••"
                  className={`${inputBase} ${errors.confirmPassword ? inputErr : inputOk} pl-9`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-900 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Créer mon compte
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-6">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-[#EE9D34] font-medium hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}