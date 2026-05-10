import React, { useRef, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import gsap from 'gsap';
import { useGeoLocation } from '../hooks/useGeoLocation';

interface ProductCardProps {
  product: Product;
  index: number;
}

// Deterministic rating from product id — gives 4.5–4.9 range
const getRating = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  const ratings = [4.5, 4.6, 4.7, 4.7, 4.8, 4.8, 4.8, 4.9];
  return ratings[Math.abs(hash) % ratings.length];
};

export const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const rating = useMemo(() => getRating(product.id), [product.id]);
  const { isIndia } = useGeoLocation();

  // Geo-aware price: show USD for international, INR for India
  const displayPrice = useMemo(() => {
    const anyProduct = product as any;
    if (!isIndia && anyProduct.price_usd) {
      return { symbol: '$', value: Number(anyProduct.price_usd), locale: 'en-US' };
    }
    return { symbol: '₹', value: Number(anyProduct.price || 999), locale: 'en-IN' };
  }, [isIndia, product]);

  useEffect(() => {
    if (!cardRef.current || window.innerWidth < 768) return;

    const card = cardRef.current;

    const onMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = card.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;

      gsap.to(card, {
        rotationY: x * 12,
        rotationX: -y * 12,
        duration: 0.4,
        ease: 'power2.out',
      });

      // Move glow to cursor position
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          x: e.clientX - left - 120,
          y: e.clientY - top - 120,
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    };

    const onMouseEnter = () => {
      gsap.to(card, {
        y: -6,
        boxShadow: '0 20px 50px rgba(0,0,0,0.15), 0 0 0 1px rgba(59,130,246,0.3)',
        borderColor: 'rgba(59,130,246,0.5)',
        duration: 0.25,
        ease: 'power2.out',
      });
    };

    const onMouseLeave = () => {
      gsap.to(card, {
        rotationY: 0,
        rotationX: 0,
        y: 0,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        borderColor: 'rgba(229,231,235,0.7)',
        duration: 0.5,
        ease: 'power3.out'
      });
      if (glowRef.current) {
        gsap.to(glowRef.current, { opacity: 0, duration: 0.4 });
      }
    };

    card.addEventListener('mousemove', onMouseMove);
    card.addEventListener('mouseenter', onMouseEnter);
    card.addEventListener('mouseleave', onMouseLeave);

    return () => {
      card.removeEventListener('mousemove', onMouseMove);
      card.removeEventListener('mouseenter', onMouseEnter);
      card.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay: (index % 3) * 0.08,
        ease: [0.16, 1, 0.3, 1]
      }}
      style={{ perspective: 800 }}
    >
      {/* Cursor glow — outside card so overflow-hidden doesn't clip it */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute w-[260px] h-[260px] rounded-full opacity-0 z-50"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, rgba(99,102,241,0.1) 40%, transparent 70%)',
          filter: 'blur(24px)',
          top: 0,
          left: 0,
        }}
      />
      <div
        ref={cardRef}
        className="relative h-full bg-white rounded-2xl md:rounded-3xl overflow-hidden flex flex-col border border-gray-200/70 cursor-pointer"
        style={{
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >

        {/* Image — centered logo on white background */}
        <Link to={`/product/${product.id}`} className="block overflow-hidden relative border-b border-gray-200">
          <div className="w-full h-[130px] md:h-[200px] relative flex items-center justify-center bg-white overflow-hidden">
            {/* Main centered logo */}
            <img
              src={product.image?.includes('unsplash.com') ? `${product.image.split('?')[0]}?w=600&h=360&fit=crop&q=75&auto=format` : product.image}
              alt={product.title}
              loading="lazy"
              decoding="async"
              className="relative z-10 max-h-[120px] md:max-h-[150px] max-w-[75%] w-auto object-contain transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
          </div>
        </Link>

        {/* Content */}
        <div className="px-3 pt-3 pb-3 md:px-6 md:pt-6 md:pb-6 flex flex-col flex-grow">
          {/* Stars + rating */}
          <div className="flex items-center gap-0.5 mb-2 md:mb-4">
            {[...Array(5)].map((_, i) => {
              const filled = i < Math.floor(rating);
              const partial = !filled && i < Math.ceil(rating);
              return (
                <Star
                  key={i}
                  size={10}
                  className={`md:!w-3 md:!h-3 ${filled || partial ? "text-amber-400" : "text-gray-200"}`}
                  fill={filled ? "#fbbf24" : partial ? "#fbbf24" : "#e5e7eb"}
                  stroke="none"
                />
              );
            })}
            <span className="text-[9px] md:text-[10px] font-semibold text-gray-400 ml-1">{rating}</span>
          </div>

          {/* Title */}
          <Link to={`/product/${product.id}`}>
            <h3 className="text-base md:text-xl font-bold text-gray-900 leading-snug tracking-tight mb-1 md:mb-2 hover:text-blue-600 transition-colors duration-200 truncate">
              {product.title}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-[10px] md:text-xs text-[#6b7280] leading-relaxed font-medium mb-2 md:mb-5 line-clamp-1 md:line-clamp-2">
            {product.description}
          </p>

          {/* Category pill */}
          {product.category && (
            <div className="mt-1 mb-2 md:mt-2 md:mb-5">
              <span className="inline-block px-2 py-0.5 md:px-3 md:py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] md:text-[10px] font-semibold tracking-wide">
                {product.category}
              </span>
            </div>
          )}

          {/* Price + CTA — stacked */}
          <div className="mt-auto pt-3 md:pt-4 border-t border-gray-100 flex flex-col gap-2 md:gap-3">
            <span className="text-lg md:text-[28px] font-extrabold text-gray-900 tracking-tight leading-none">
              {displayPrice.symbol}{displayPrice.value.toLocaleString(displayPrice.locale)}
            </span>
            <Link
              to={`/product/${product.id}`}
              className="relative w-full overflow-hidden flex items-center justify-center gap-1.5 min-h-[44px] py-2 md:py-3 bg-blue-600 text-white rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-wider hover:bg-blue-700 hover:scale-[1.03] hover:shadow-lg hover:shadow-blue-600/30 transition-all duration-200 active:scale-95 group/checkout"
            >
              {/* Shimmer sweep */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover/checkout:translate-x-[200%] transition-transform duration-700 ease-in-out pointer-events-none" />
              <span className="relative z-10 transition-transform duration-200 group-hover/checkout:-translate-x-0.5">Checkout</span>
              <ArrowRight size={15} className="relative z-10 transition-transform duration-200 group-hover/checkout:translate-x-1 group-hover/checkout:scale-110" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
