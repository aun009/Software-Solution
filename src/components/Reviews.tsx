import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Star, BadgeCheck } from 'lucide-react';

// Real-looking international reviewers with diverse backgrounds
const reviews = [
  {
    id: 1,
    name: "Rahul Sharma",
    role: "Freelance Developer",
    rating: 4.8,
    content: "SP Tech Solutions has completely changed how I discover software. The product detail pages are incredibly well-organized — I found exactly what I needed within minutes.",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face&q=80",
    platform: "Verified Purchase",
  },
  {
    id: 2,
    name: "Emma Rousseau",
    role: "UX Product Designer",
    rating: 4.5,
    content: "Beautifully designed platform. The UI is clean, intuitive and just works. I bought an AI writing tool and support via WhatsApp was instant. Highly recommend!",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face&q=80",
    platform: "Verified Purchase",
  },
  {
    id: 3,
    name: "Priya Patel",
    role: "Startup Founder",
    rating: 4.9,
    content: "Outstanding experience from start to finish. The software catalog is curated and trustworthy — not like those cluttered directories. Will use again for our next tool.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face&q=80",
    platform: "via WhatsApp",
  },
  {
    id: 4,
    name: "James Whitfield",
    role: "Digital Marketing Lead",
    rating: 4.6,
    content: "Really impressed with the range of tools available. The descriptions are accurate and detailed. Makes it easy to compare and choose the right tool for the job.",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face&q=80",
    platform: "Verified Purchase",
  },
  {
    id: 5,
    name: "Amit Kumar",
    role: "UI/UX Designer",
    rating: 4.7,
    content: "I love the dark mode on the product detail pages. Everything feels so premium and responsive. The checkout process was smooth and secure.",
    avatar: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=100&h=100&fit=crop&crop=face&q=80",
    platform: "via WhatsApp",
  },
  {
    id: 6,
    name: "Yuki Tanaka",
    role: "AI Research Engineer",
    rating: 4.7,
    content: "The AI tools section is fantastic. As someone in the field, I appreciate that the descriptions are accurate and not over-hyped. Great curation and smooth checkout.",
    avatar: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=100&h=100&fit=crop&crop=face&q=80",
    platform: "Verified Purchase",
  }
];

// Renders full + half + empty stars for a given rating like 4.3, 4.7
const StarRating = ({ rating }: { rating: number }) => {
  const full = Math.floor(rating);
  const half = rating - full >= 0.4;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(full)].map((_, i) => (
        <Star key={`f${i}`} size={13} className="text-amber-400 fill-amber-400" />
      ))}
      {half && (
        <span className="relative inline-block w-[13px] h-[13px]">
          <Star size={13} className="text-gray-200 fill-gray-200 absolute inset-0" />
          <span className="absolute inset-0 overflow-hidden w-[50%]">
            <Star size={13} className="text-amber-400 fill-amber-400" />
          </span>
        </span>
      )}
      {[...Array(empty)].map((_, i) => (
        <Star key={`e${i}`} size={13} className="text-gray-200 fill-gray-200" />
      ))}
    </div>
  );
};

interface ReviewCardProps {
  review: typeof reviews[0];
  idx: number;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, idx }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: idx * 0.08, ease: 'easeOut' }}
    className="bg-white border border-gray-100 rounded-3xl p-7 flex flex-col gap-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
  >
    {/* Stars */}
    <StarRating rating={review.rating} />

    {/* Quote */}
    <p className="text-[15px] text-gray-700 leading-[1.8] font-normal flex-grow">
      "{review.content}"
    </p>

    {/* Author row */}
    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
      <img
        src={review.avatar}
        alt={review.name}
        loading="lazy"
        decoding="async"
        className="w-10 h-10 rounded-full object-cover shadow-sm"
        referrerPolicy="no-referrer"
      />
      <div>
        <p className="text-[13px] font-bold text-gray-900 leading-tight">{review.name}</p>
        <p className="text-[12px] text-gray-400 font-medium">{review.role}</p>
      </div>
      <div className="ml-auto text-[12px] font-semibold text-amber-500">{review.rating.toFixed(1)}</div>
    </div>
  </motion.div>
);

export const Reviews = () => {
  const [showAll, setShowAll] = useState(false);

  const avgRating = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <section id="reviews-section" className="py-24 bg-gradient-to-b from-white to-gray-50/60 relative overflow-hidden border-t border-gray-100 font-sans scroll-mt-24">
      {/* Subtle background decorations */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-blue-50/60 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-purple-50/50 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          {/* Overall rating pill */}
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-full px-4 py-1.5 mb-6">
            <Star size={14} className="text-amber-500 fill-amber-500" />
            <span className="text-sm font-black text-amber-700">{avgRating} average rating</span>
            <span className="text-gray-300 mx-1">·</span>
            {/* <span className="text-[12px] font-semibold text-amber-600">{reviews.length} global reviews</span> */}
          </div>

          <h2 className="text-3xl md:text-5xl font-['Plus_Jakarta_Sans'] font-extrabold text-gray-900 tracking-tight mb-4">
            Trusted by Creators and Professional <span className="text-blue-600">Worldwide</span>
          </h2>
          <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto">
            See what our community has to say about our tools.
          </p>
        </motion.div>

        {/* Always-visible first 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {reviews.slice(0, 3).map((review, idx) => (
            <ReviewCard key={`rv-${review.id}`} review={review} idx={idx} />
          ))}
        </div>

        {/* Extra reviews */}
        {reviews.length > 3 && (
          <>
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 overflow-hidden transition-all duration-500 ease-in-out"
              style={{
                maxHeight: showAll ? '2000px' : '0px',
                opacity: showAll ? 1 : 0,
                marginTop: showAll ? '24px' : '0px',
              }}
            >
              {reviews.slice(3).map((review, idx) => (
                <ReviewCard key={`rv-${review.id}`} review={review} idx={idx} />
              ))}
            </div>

            <div className="mt-10 flex justify-center">
              <button
                onClick={() => {
                  if (showAll) {
                    const el = document.getElementById('reviews-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    setTimeout(() => setShowAll(false), 350);
                  } else {
                    setShowAll(true);
                  }
                }}
                className="group px-7 py-3 bg-white border border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-700 hover:text-blue-700 rounded-full text-sm font-bold transition-all shadow-sm flex items-center gap-2"
              >
                {showAll ? 'Show Less' : `View All ${reviews.length} Reviews`}
                <svg
                  width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  className={`transition-transform duration-300 ${showAll ? 'rotate-[-90deg]' : 'rotate-90'}`}
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};
