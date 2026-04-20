import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: "Rahul Sharma",
    role: "Freelance Developer",
    content: "The software hub made it incredibly easy to find the exact tools I needed. Saved me hours of research.",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop"
  },
  {
    id: 2,
    name: "Priya Patel",
    role: "Startup Founder",
    content: "Very clean UI and the product information is spot on. Bought a tool and it worked perfectly for our team.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop"
  },
  {
    id: 3,
    name: "Amit Kumar",
    role: "UI/UX Designer",
    content: "I love the dark mode on the product detail pages. Everything feels so premium and responsive.",
    avatar: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=150&h=150&fit=crop"
  },
  {
    id: 4,
    name: "Sneha Reddy",
    role: "Product Manager",
    content: "It's super easy to navigate and find what you need. A well-organized catalog of tools.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
  },
  {
    id: 5,
    name: "Vikram Singh",
    role: "Software Architect",
    content: "Great collection of AI tools. Highly recommend browsing through if you want to scale fast.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop"
  },
  {
    id: 6,
    name: "Anjali Gupta",
    role: "Content Creator",
    content: "Smooth checkout process and amazing customer support via WhatsApp. Really impressed.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop"
  }
];

const ReviewCard = ({ review, idx }: { review: typeof reviews[0]; idx: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98, y: 10 }}
    whileInView={{ opacity: 1, scale: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay: idx * 0.1, ease: 'easeOut' }}
    className="bg-gradient-to-b from-white to-gray-50/50 border border-gray-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.08)] hover:-translate-y-1 transition-all duration-300 p-8 rounded-[2rem] flex flex-col h-full min-h-[260px] relative overflow-hidden group"
  >
    {/* Decorative glowing gradient that appears on hover */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    
    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-110 transition-all duration-500 pointer-events-none transform origin-top-right">
      <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
    </div>
    
    <div className="mb-6 flex justify-between items-start relative z-10">
      <div className="relative">
        <img src={review.avatar} alt={review.name} className="w-14 h-14 rounded-full object-cover shadow-md border-2 border-white relative z-10" />
        <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 scale-110 -z-0" />
      </div>
      <div className="flex gap-1 text-yellow-400 bg-yellow-50/80 backdrop-blur-sm border border-yellow-100/50 shadow-sm px-3 py-1.5 rounded-full">
        {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
      </div>
    </div>
    
    <p className="text-gray-700 leading-relaxed font-medium mb-8 flex-grow text-[15px] relative z-10 italic">"{review.content}"</p>
    
    <div className="mt-auto relative z-10 pt-6 border-t border-gray-100/80">
      <p className="text-sm text-gray-500 font-medium flex flex-col">
        <span className="font-bold text-gray-900 text-base mb-1">{review.name}</span>
        <span className="text-[13px] tracking-wide uppercase font-semibold text-blue-600/80">{review.role}</span>
      </p>
    </div>
  </motion.div>
);

export const Reviews = () => {
  const [showAll, setShowAll] = useState(false);

  return (
    <section id="reviews-section" className="py-24 bg-white relative overflow-hidden border-t border-gray-100 font-sans scroll-mt-24">
      <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-['Plus_Jakarta_Sans'] font-extrabold text-gray-900 tracking-tight mb-4">Trusted by builders</h2>
          <p className="text-gray-500 text-lg">See what our community has to say about our tools.</p>
        </motion.div>
        
        {/* Always-visible first 3 reviews */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((review, idx) => (
            <ReviewCard key={review.id} review={review} idx={idx} />
          ))}
        </div>

        {/* Extra reviews — smooth expand/collapse */}
        {reviews.length > 3 && (
          <>
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-hidden transition-all duration-500 ease-in-out"
              style={{
                maxHeight: showAll ? '800px' : '0px',
                opacity: showAll ? 1 : 0,
                marginTop: showAll ? '24px' : '0px',
              }}
            >
              {reviews.slice(3).map((review, idx) => (
                <ReviewCard key={review.id} review={review} idx={idx} />
              ))}
            </div>

            <div className="mt-12 flex justify-center">
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
                className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-800 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 group"
              >
                {showAll ? 'View Less' : 'View More'}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${showAll ? 'rotate-[-90deg] group-hover:-translate-y-1' : 'group-hover:translate-x-1'}`}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};
