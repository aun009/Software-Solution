import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import gsap from 'gsap';

interface ProductCardProps {
  product: Product;
  index: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current || window.innerWidth < 768) return;

    const card = cardRef.current;
    
    const onMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = card.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      
      const xPercent = (x / width - 0.5) * 20; // 3D Tilt
      const yPercent = (y / height - 0.5) * -20;
      
      gsap.to(card, {
        rotationY: xPercent,
        rotationX: yPercent,
        scale: 1.05,
        duration: 0.4,
        ease: 'power2.out',
        perspective: 1000
      });

      if (glowRef.current) {
        gsap.to(glowRef.current, {
          x: x - 150,
          y: y - 150,
          opacity: 1,
          duration: 0.6
        });
      }
    };

    const onMouseLeave = () => {
      gsap.to(card, {
        rotationY: 0,
        rotationX: 0,
        scale: 1,
        duration: 0.6,
        ease: 'power3.out'
      });
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          opacity: 0,
          duration: 0.6
        });
      }
    };

    card.addEventListener('mousemove', onMouseMove);
    card.addEventListener('mouseleave', onMouseLeave);

    return () => {
      card.removeEventListener('mousemove', onMouseMove);
      card.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.8, 
        delay: (index % 4) * 0.1,
        ease: [0.16, 1, 0.3, 1] 
      }}
      className="relative perspective-1000"
    >
      <div 
        ref={cardRef}
        className="relative h-full bg-white dark:bg-[#0d0d0d] border border-gray-100 dark:border-white/5 rounded-[32px] overflow-hidden flex flex-col hover:border-blue-500/30 transition-all duration-300 shadow-xl dark:shadow-2xl group"
      >
        {/* Dynamic Glow Overlay */}
        <div 
          ref={glowRef}
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 z-10"
          style={{
            background: 'radial-gradient(300px circle at center, rgba(59, 130, 246, 0.15), transparent 80%)',
          }}
        />

        {/* Card Header / Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <img 
            src={product.image} 
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] dark:from-[#0d0d0d] light:from-white via-transparent to-transparent opacity-80" />
          
          <div className="absolute top-6 left-6">
            <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-blue-400 border border-blue-500/20">
              {product.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 flex flex-col flex-grow relative z-20">
          <div className="flex items-center gap-1 text-yellow-500/30 mb-4">
             <Star size={12} fill="currentColor" />
             <Star size={12} fill="currentColor" />
             <Star size={12} fill="currentColor" />
             <Star size={12} fill="currentColor" />
             <Star size={12} fill="currentColor" />
          </div>
          <h3 className="text-2xl font-black dark:text-white text-gray-900 mb-3 tracking-tighter group-hover:text-blue-500 transition-colors">
            {product.title}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-3 mb-8 leading-relaxed font-medium">
            {product.description}
          </p>
          
          <div className="mt-auto pt-6 flex items-center justify-between border-t border-gray-100 dark:border-white/5">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-gray-500 dark:text-gray-600 uppercase tracking-widest mb-1">Projected Cost</span>
              <span className="text-xl font-black text-gray-900 dark:text-white italic tracking-tighter">${product.price || '999'}</span>
            </div>
            <Link 
              to={`/product/${product.id}`}
              className="px-6 py-3 bg-gray-900 text-white dark:bg-white dark:text-black rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg hover:bg-blue-600 hover:text-white transition-all transform active:scale-95 flex items-center gap-2"
            >
              Analyze
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
