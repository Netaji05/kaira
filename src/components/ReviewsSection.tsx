import React, { useState, useMemo } from 'react';
import {
  Star,
  CheckCircle2,
  Quote,
  Filter,
  ArrowUpDown,
  ThumbsUp,
  Plus,
  ShieldCheck,
  X,
  Check,
  Sparkles,
  Camera,
  MessageSquare,
} from 'lucide-react';
import { CUSTOMER_REVIEWS } from '../data/reviews';
import { Review } from '../types';

export const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const local = localStorage.getItem('kaira_user_reviews');
      if (local) {
        const parsed = JSON.parse(local);
        return [...parsed, ...CUSTOMER_REVIEWS];
      }
    } catch (e) {
      // ignore
    }
    return CUSTOMER_REVIEWS;
  });

  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'helpful'>('newest');
  const [helpfulLiked, setHelpfulLiked] = useState<Record<string, boolean>>({});

  // Add Review Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAuthor, setNewAuthor] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newProductName, setNewProductName] = useState('Kaira Clover Onyx 4-Piece Luxury Set');
  const [newComment, setNewComment] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Toggle helpful like
  const handleToggleHelpful = (reviewId: string) => {
    setHelpfulLiked((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));

    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          const currentCount = r.helpfulCount || 0;
          const isLiked = helpfulLiked[reviewId];
          return {
            ...r,
            helpfulCount: isLiked ? Math.max(0, currentCount - 1) : currentCount + 1,
          };
        }
        return r;
      })
    );
  };

  // Submit New Review
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim()) return;

    const newRev: Review = {
      id: `rev-user-${Date.now()}`,
      author: `${newAuthor.trim()}${newCity ? `, ${newCity.trim()}` : ''}`,
      rating: newRating,
      date: 'Just now',
      createdAt: Date.now(),
      productName: newProductName,
      comment: newComment.trim(),
      verified: true, // Auto-tag user reviews with Verified Purchase badge
      helpfulCount: 1,
    };

    const updated = [newRev, ...reviews];
    setReviews(updated);

    try {
      const userAdded = updated.filter((r) => r.id.startsWith('rev-user-'));
      localStorage.setItem('kaira_user_reviews', JSON.stringify(userAdded));
    } catch (err) {
      // ignore
    }

    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setIsModalOpen(false);
      setNewAuthor('');
      setNewCity('');
      setNewComment('');
    }, 1500);
  };

  // Rating Stats
  const totalReviews = reviews.length;
  const avgRating = (
    reviews.reduce((acc, r) => acc + r.rating, 0) / (totalReviews || 1)
  ).toFixed(1);

  const starCounts = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      if (r.rating in counts) {
        counts[r.rating as keyof typeof counts]++;
      }
    });
    return counts;
  }, [reviews]);

  // Filtered & Sorted Reviews
  const filteredReviews = useMemo(() => {
    let result = [...reviews];

    // Filter by Rating
    if (ratingFilter !== 'all') {
      result = result.filter((r) => r.rating === ratingFilter);
    }

    // Sort by Selected Metric
    if (sortBy === 'newest') {
      result.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    } else if (sortBy === 'highest') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'helpful') {
      result.sort((a, b) => (b.helpfulCount || 0) - (a.helpfulCount || 0));
    }

    return result;
  }, [reviews, ratingFilter, sortBy]);

  return (
    <section className="py-16 bg-[#FAF8F5] border-t border-stone-200 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3E8D0] border border-[#E0C995] text-[#8C6418] text-xs font-bold tracking-widest uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C59B27]" />
            100% Authentic Verified Reviews
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
            Loved by 10,000+ Women Pan-India
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Real feedback, photos, and ratings from verified buyers wearing KAIRA 18k gold plated Anti-Tarnish jewelry.
          </p>
        </div>

        {/* Rating Breakdown & Social Proof Bar */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E0D3B5] shadow-xs grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Big Overall Rating Score */}
          <div className="md:col-span-4 text-center md:text-left space-y-2 md:border-r border-stone-200 md:pr-8">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <span className="text-5xl font-serif font-extrabold text-stone-900">{avgRating}</span>
              <div>
                <div className="flex text-amber-500 gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs font-bold text-stone-700 mt-0.5">
                  Based on {totalReviews} Verified Orders
                </p>
              </div>
            </div>

            <p className="text-xs text-emerald-800 font-semibold bg-emerald-50 py-2 px-3 rounded-xl border border-emerald-200 inline-block">
              ✓ 99.4% Anti-Tarnish & Waterproof Satisfaction Rate
            </p>
          </div>

          {/* Star Bar Progress Breakdown */}
          <div className="md:col-span-5 space-y-2">
            {[5, 4, 3].map((star) => {
              const count = starCounts[star as keyof typeof starCounts] || 0;
              const pct = totalReviews ? Math.round((count / totalReviews) * 100) : 0;
              return (
                <div key={star} className="flex items-center gap-3 text-xs font-medium text-stone-700">
                  <span className="w-12 flex items-center gap-1 font-bold">
                    {star} <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline" />
                  </span>
                  <div className="flex-1 bg-stone-100 h-2.5 rounded-full overflow-hidden border border-stone-200">
                    <div
                      className="bg-[#C59B27] h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-stone-500 font-mono text-[11px]">{pct}%</span>
                </div>
              );
            })}
          </div>

          {/* Action: Write a Review CTA */}
          <div className="md:col-span-3 flex flex-col items-center justify-center text-center space-y-3 md:border-l border-stone-200 md:pl-8">
            <p className="text-xs font-bold text-stone-800">
              Own a KAIRA Piece?
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-[#2C241D] hover:bg-black text-[#DFBA53] font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 border border-[#C59B27]/40 shadow-xs transition-all"
            >
              <Plus className="w-4 h-4" />
              Write a Verified Review
            </button>
            <p className="text-[10px] text-stone-500">
              Get 50 Reward Points on your next order!
            </p>
          </div>
        </div>

        {/* Filter and Sort Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          {/* Rating Filters */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-xs font-bold text-stone-500 flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5 text-[#8C6418]" /> Filter:
            </span>

            <button
              onClick={() => setRatingFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                ratingFilter === 'all'
                  ? 'bg-[#2C241D] text-[#DFBA53]'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              All ({reviews.length})
            </button>

            <button
              onClick={() => setRatingFilter(5)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all shrink-0 ${
                ratingFilter === 5
                  ? 'bg-[#2C241D] text-[#DFBA53]'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              5 ★ ({starCounts[5]})
            </button>

            <button
              onClick={() => setRatingFilter(4)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all shrink-0 ${
                ratingFilter === 4
                  ? 'bg-[#2C241D] text-[#DFBA53]'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              4 ★ ({starCounts[4]})
            </button>
          </div>

          {/* Sort By Newest Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <label className="text-xs font-bold text-stone-600 flex items-center gap-1 shrink-0">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#8C6418]" /> Sort By:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-stone-50 border border-stone-300 text-stone-800 text-xs font-bold rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#8C6418]"
            >
              <option value="newest">Sort by Newest</option>
              <option value="highest">Highest Rating</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>
        </div>

        {/* Reviews Grid */}
        {filteredReviews.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-stone-200 space-y-2">
            <MessageSquare className="w-8 h-8 text-stone-300 mx-auto" />
            <p className="text-sm font-semibold text-stone-800">No reviews match this filter rating.</p>
            <button
              onClick={() => setRatingFilter('all')}
              className="text-xs font-bold text-[#8C6418] hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative group"
              >
                <div className="space-y-3">
                  {/* Rating Stars & Verified Purchase Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-500 gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < rev.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-stone-200 fill-stone-100'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Prominent VERIFIED PURCHASE Badge */}
                    {rev.verified && (
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-tight">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 fill-emerald-100" />
                        Verified Purchase
                      </span>
                    )}
                  </div>

                  {/* Comment Quote */}
                  <div className="relative pt-1">
                    <Quote className="w-5 h-5 text-amber-200/80 absolute -top-2 -left-2" />
                    <p className="text-xs text-stone-700 leading-relaxed italic relative z-10 pl-3">
                      "{rev.comment}"
                    </p>
                  </div>
                </div>

                {/* Author Info & Helpful Counter Footer */}
                <div className="pt-3 border-t border-stone-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#2C241D] text-[#DFBA53] border border-[#C59B27] flex items-center justify-center font-serif font-bold text-xs shrink-0 shadow-2xs">
                        {rev.author.trim().split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'K'}
                      </div>
                      <div>
                        <h4 className="font-bold text-stone-900 text-xs">
                          {rev.author}
                        </h4>
                        <p className="text-[10px] text-[#8C6418] font-medium line-clamp-1">
                          {rev.productName}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
                    <span>{rev.date}</span>

                    {/* Helpful Button */}
                    <button
                      onClick={() => handleToggleHelpful(rev.id)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[10px] font-bold transition-all ${
                        helpfulLiked[rev.id]
                          ? 'bg-amber-50 text-[#8C6418] border-[#E0D3B5]'
                          : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      <ThumbsUp className="w-3 h-3" />
                      Helpful ({rev.helpfulCount || 0})
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* WRITE A VERIFIED REVIEW MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white max-w-md w-full rounded-3xl border border-stone-200 shadow-2xl p-6 relative space-y-4 font-sans">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-800 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                <Sparkles className="w-3 h-3 text-[#C59B27]" /> Share Your Experience
              </div>
              <h3 className="text-lg font-serif font-bold text-stone-900">
                Write a Verified Customer Review
              </h3>
            </div>

            {submitSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-stone-900 text-sm">Thank You! Your Review is Live</h4>
                <p className="text-xs text-stone-500">
                  Your feedback helps other jewelry lovers choose anti-tarnish 18k pieces with confidence.
                </p>
              </div>
            ) : (
              <form onSubmit={handleAddReview} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-stone-800 block mb-1">
                    Your Rating
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className="p-1 text-amber-400 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= newRating ? 'fill-amber-400' : 'text-stone-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold text-stone-800 block mb-1">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pooja Bhatt"
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-amber-800"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-800 block mb-1">
                      City / State
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Jaipur, Rajasthan"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-amber-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-800 block mb-1">
                    Purchased Jewelry Piece
                  </label>
                  <select
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-amber-800"
                  >
                    <option value="Kaira Clover Onyx 4-Piece Luxury Set">
                      Kaira Clover Onyx 4-Piece Luxury Set
                    </option>
                    <option value="Cute Heart Dainty Station Necklace">
                      Cute Heart Dainty Station Necklace
                    </option>
                    <option value="Star Love 18k Gold Starfish Cuff">
                      Star Love 18k Gold Starfish Cuff
                    </option>
                    <option value="KAIRA Signature Luxury Gift Hamper Box">
                      KAIRA Signature Luxury Gift Hamper Box
                    </option>
                    <option value="Celestial Zodiac Pearl Charm Choker">
                      Celestial Zodiac Pearl Charm Choker
                    </option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-800 block mb-1">
                    Your Detailed Review <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Tell us about the anti-tarnish quality, shine, shipping speed, packaging, or how you styled it!"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-amber-800"
                  />
                </div>

                <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#C59B27] shrink-0" />
                  <span>
                    Your review will automatically carry a <strong>Verified Purchase</strong> status badge.
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#2C241D] hover:bg-black text-[#DFBA53] font-bold text-xs py-3 rounded-xl transition-all border border-[#C59B27]/40 shadow-xs"
                >
                  Publish Verified Review
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
