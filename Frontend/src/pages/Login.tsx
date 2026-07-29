import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Lock, Loader2, LogIn, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface FormErrors {
  email?: string;
  password?: string;
  global?: string;
}

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const from = (location.state as { from?: string } | null)?.from || '/profile';

  const inputBase =
    'w-full bg-gray-50 border rounded-2xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors';
  const inputOk = 'border-gray-200 focus:border-[#EE9D34]/50 focus:ring-[#EE9D34]/30';
  const inputErr = 'border-red-300 focus:border-red-400 focus:ring-red-200';

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!email.trim()) {
      next.email = "L'email est requis.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = 'Format email invalide.';
    }
    if (!password) next.password = 'Le mot de passe est requis.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch {
      setErrors({ global: 'Email ou mot de passe incorrect.' });
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
            Content de vous revoir
          </span>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Connexion</h1>
          <p className="text-sm text-gray-500 mt-2">
            Accédez à votre profil, vos commandes et vos favoris.
          </p>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white shadow-sm shadow-gray-100 p-6 sm:p-8">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {errors.global && (
              <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-2.5 text-xs text-red-600">
                {errors.global}
              </div>
            )}

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
                  placeholder="••••••••"
                  className={`${inputBase} ${errors.password ? inputErr : inputOk} pl-9`}
                />
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-900 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Connexion...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Se connecter
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-6">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-[#EE9D34] font-medium hover:underline">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}