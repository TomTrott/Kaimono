import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Star, Loader2, Check, X, Pencil } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import type { Product } from '@/types';

interface PublicReview {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  author: string;
}

interface CheckResponse {
  authenticated: boolean;
  can_review: boolean;
  order_id?: string | null;
  own_review: {
    id: string;
    rating: number;
    comment: string | null;
    order_id: string;
  } | null;
}

function StarRating({
  value,
  onChange,
  readOnly = false,
  size = 'w-5 h-5',
}: {
  value: number;
  onChange?: (v: number) => void;
  readOnly?: boolean;
  size?: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const display = hover ?? value;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(n)}
          onMouseEnter={() => !readOnly && setHover(n)}
          onMouseLeave={() => !readOnly && setHover(null)}
          className={readOnly ? 'cursor-default' : 'cursor-pointer'}
        >
          <Star className={`${size} ${n <= display ? 'fill-[#EE9D34] text-[#EE9D34]' : 'text-gray-300'}`} />
        </button>
      ))}
    </div>
  );
}

export default function ProductReviewsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<PublicReview[] | null>(null);
  const [check, setCheck] = useState<CheckResponse | null>(null);
  const [error, setError] = useState('');

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    if (!id) return;
    api.get('/products/show.php', { params: { id } }).then((res) => setProduct(res.data.product));
    api
      .get('/reviews/list.php', { params: { product_id: id } })
      .then((res) => setReviews(Array.isArray(res.data?.reviews) ? res.data.reviews : []))
      .catch(() => setError('Impossible de charger les avis.'));
    api
      .get('/reviews/check.php', { params: { product_id: id } })
      .then((res) => setCheck(res.data))
      .catch(() => setCheck({ authenticated: false, can_review: false, own_review: null }));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const startNew = () => {
    setEditing(false);
    setRating(5);
    setComment('');
    setFormOpen(true);
  };

  const startEdit = () => {
    if (!check?.own_review) return;
    setEditing(true);
    setRating(check.own_review.rating);
    setComment(check.own_review.comment ?? '');
    setFormOpen(true);
  };

  const submit = async () => {
    if (!id) return;
    setSubmitting(true);
    setError('');
    try {
      if (editing && check?.own_review) {
        await api.put('/reviews/update.php', { id: check.own_review.id, rating, comment });
      } else {
        await api.post('/reviews/create.php', {
          product_id: id,
          order_id: check?.order_id,
          rating,
          comment,
        });
      }
      setFormOpen(false);
      load();
    } catch (err) {
      const apiMessage = axios.isAxiosError(err) ? err.response?.data?.error : undefined;
      setError(apiMessage || "Impossible d'enregistrer votre avis.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!product || reviews === null || check === null) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(80vh-4rem)] bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#EE9D34] text-sm font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>

        {/* En-tête produit */}
        <div className="flex items-center gap-4 mb-8">
          <img
            src={product.image_url ?? '/placeholder.png'}
            alt={product.name}
            className="w-16 h-16 rounded-xl object-cover bg-gray-100 flex-shrink-0"
          />
          <div>
            <h1 className="text-xl font-bold text-gray-900">{product.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <StarRating value={Math.round(product.rating)} readOnly size="w-4 h-4" />
              <span className="text-sm text-gray-500">
                {product.rating.toFixed(1)} ({product.reviews_count ?? reviews.length} avis)
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-2.5 text-xs text-red-600 mb-6">
            {error}
          </div>
        )}

        {/* Bloc dépôt / gestion d'avis */}
        <div className="rounded-3xl border border-gray-200 bg-white shadow-sm shadow-gray-100 p-6 mb-8">
          {!check.authenticated ? (
            <p className="text-sm text-gray-600">
              <Link to="/login" state={{ from: `/produits/${id}/avis` }} className="text-[#EE9D34] font-medium hover:underline">
                Connectez-vous
              </Link>{' '}
              pour laisser un avis sur ce produit.
            </p>
          ) : check.own_review && !formOpen ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">Votre avis</p>
                <StarRating value={check.own_review.rating} readOnly size="w-4 h-4" />
                {check.own_review.comment && (
                  <p className="text-sm text-gray-600 mt-2">{check.own_review.comment}</p>
                )}
              </div>
              <button
                onClick={startEdit}
                className="flex items-center gap-1.5 text-sm font-medium text-[#EE9D34] hover:underline flex-shrink-0"
              >
                <Pencil className="w-3.5 h-3.5" />
                Modifier
              </button>
            </div>
          ) : check.can_review && !formOpen ? (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Vous avez acheté ce produit.</p>
              <button
                onClick={startNew}
                className="px-4 py-2 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Donner mon avis
              </button>
            </div>
          ) : !formOpen ? (
            <p className="text-sm text-gray-500">
              Seuls les clients ayant acheté et reçu ce produit peuvent le noter.
            </p>
          ) : null}

          {formOpen && (
            <div className="space-y-3 mt-2">
              <StarRating value={rating} onChange={setRating} />
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Votre avis (facultatif)"
                rows={3}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:border-[#EE9D34]/50 focus:ring-[#EE9D34]/30 transition-colors resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={submit}
                  disabled={submitting}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-60 transition-colors"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  {editing ? 'Enregistrer' : 'Publier'}
                </button>
                <button
                  onClick={() => setFormOpen(false)}
                  disabled={submitting}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-full border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Liste des avis */}
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Avis clients</h2>
        {reviews.length === 0 ? (
          <p className="text-sm text-gray-500 py-8 text-center">Aucun avis pour ce produit pour le moment.</p>
        ) : (
          <div className="space-y-3">
            {reviews.map((r) => (
              <div key={r.id} className="rounded-2xl border border-gray-200 bg-white p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">{r.author}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(r.created_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <StarRating value={r.rating} readOnly size="w-3.5 h-3.5" />
                {r.comment && <p className="text-sm text-gray-600 mt-2">{r.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}